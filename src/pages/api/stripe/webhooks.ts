import type { APIRoute } from 'astro';
import Stripe from 'stripe';

// Stripe webhook handler for subscription events
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const stripeSecretKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeSecretKey || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: 'Stripe not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });
  
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Supabase REST API helper
  const supabase = {
    upsert: async (table: string, data: any, onConflict: string) => {
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': `resolution=merge-duplicates,return=representation,on-conflict=${onConflict}`,
        },
        body: JSON.stringify(data),
      });
      return res;
    },
    update: async (table: string, match: Record<string, any>, data: any) => {
      const query = Object.entries(match)
        .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
        .join('&');
      const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return res;
    },
  };
  
  try {
    console.log('Processing webhook:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const serverId = session.metadata?.server_id;
        const tier = session.metadata?.tier;
        
        if (!serverId || !tier) {
          console.error('Missing metadata in checkout session');
          break;
        }
        
        // Fetch subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Upsert subscription record
        await supabase.upsert('server_subscriptions', {
          server_id: serverId,
          tier: tier,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: session.customer as string,
          amount_cents: subscription.items.data[0].price.unit_amount || 0,
          currency: subscription.currency,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          created_at: new Date().toISOString(),
        }, 'stripe_subscription_id');
        
        // Update server tier
        await supabase.update('servers', { id: serverId }, {
          tier: tier,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: session.customer as string,
          premium_started_at: new Date().toISOString(),
          premium_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        
        console.log(`✅ Server ${serverId} upgraded to ${tier}`);
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        if (!subscriptionId) break;
        
        // Update subscription period
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        await supabase.upsert('server_subscriptions', {
          stripe_subscription_id: subscriptionId,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, 'stripe_subscription_id');
        
        // Update server expiration
        const serverRes = await fetch(
          `${supabaseUrl}/rest/v1/server_subscriptions?stripe_subscription_id=eq.${subscriptionId}&select=server_id`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            }
          }
        );
        
        if (serverRes.ok) {
          const subs = await serverRes.json();
          if (subs && subs.length > 0) {
            await supabase.update('servers', { id: subs[0].server_id }, {
              premium_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            });
          }
        }
        
        console.log(`💰 Invoice paid for subscription ${subscriptionId}`);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        
        if (!subscriptionId) break;
        
        await supabase.upsert('server_subscriptions', {
          stripe_subscription_id: subscriptionId,
          status: 'past_due',
          updated_at: new Date().toISOString(),
        }, 'stripe_subscription_id');
        
        console.log(`⚠️ Payment failed for subscription ${subscriptionId}`);
        break;
      }
      
      case 'customer.subscription.deleted':
      case 'customer.subscription.canceled': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        
        // Mark subscription as canceled
        await supabase.upsert('server_subscriptions', {
          stripe_subscription_id: subscriptionId,
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, 'stripe_subscription_id');
        
        // Downgrade server to free
        const serverRes = await fetch(
          `${supabaseUrl}/rest/v1/server_subscriptions?stripe_subscription_id=eq.${subscriptionId}&select=server_id`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            }
          }
        );
        
        if (serverRes.ok) {
          const subs = await serverRes.json();
          if (subs && subs.length > 0) {
            await supabase.update('servers', { id: subs[0].server_id }, {
              tier: 'free',
              premium_expires_at: null,
              stripe_subscription_id: null,
            });
            console.log(`⬇️ Server ${subs[0].server_id} downgraded to free`);
          }
        }
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase.upsert('server_subscriptions', {
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, 'stripe_subscription_id');
        
        console.log(`📝 Subscription ${subscription.id} updated`);
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
