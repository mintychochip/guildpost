import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Price IDs - these should be set in your Stripe dashboard
const PRICE_IDS = {
  premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_monthly',
  elite: process.env.STRIPE_PRICE_ELITE || 'price_elite_monthly',
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const stripeSecretKey = env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    return new Response(
      JSON.stringify({ error: 'Stripe not configured' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });
  
  try {
    const { serverId, tier, email, successUrl, cancelUrl } = await request.json();
    
    if (!serverId || !tier || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: serverId, tier, email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!['premium', 'elite'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier. Must be premium or elite' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
    const supabaseKey = env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch server details
    const serverRes = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(serverId)}&select=id,name,billing_email,stripe_customer_id`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );
    
    if (!serverRes.ok) {
      throw new Error('Failed to fetch server');
    }
    
    const servers = await serverRes.json();
    if (!servers || servers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Server not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const server = servers[0];
    
    // Get or create Stripe customer
    let customerId = server.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          server_id: serverId,
          server_name: server.name,
        },
      });
      customerId = customer.id;
      
      // Save customer ID to server
      await fetch(
        `${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(serverId)}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripe_customer_id: customerId,
            billing_email: email,
          }),
        }
      );
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: PRICE_IDS[tier as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          server_id: serverId,
          tier: tier,
        },
      },
      success_url: successUrl || `https://guildpost.tech/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `https://guildpost.tech/dashboard?upgrade=canceled`,
      metadata: {
        server_id: serverId,
        tier: tier,
      },
    });
    
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create checkout session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders, status: 204 });
};
