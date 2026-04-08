import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Create customer portal session for managing subscription
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
    const { serverId } = await request.json();
    
    if (!serverId) {
      return new Response(
        JSON.stringify({ error: 'serverId required' }),
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
    
    // Fetch server
    const serverRes = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(serverId)}&select=id,stripe_customer_id`,
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
    
    if (!server.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: server.stripe_customer_id,
      return_url: `https://guildpost.tech/dashboard?server=${serverId}`,
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (err: any) {
    console.error('Portal error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create portal session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders, status: 204 });
};
