import type { APIRoute } from 'astro';

export const prerender = false;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const GET: APIRoute = async ({ locals }) => {
  // Access env vars from Cloudflare Pages runtime
  const env = (locals as any)?.runtime?.env || (globalThis as any).process?.env || {};
  const supabaseUrl = env.SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.PUBLIC_SUPABASE_ANON_KEY;

  // Environment validation (silent in production)

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ 
      error: 'Supabase not configured',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch all servers using pagination (Supabase has 1000 row limit per request)
    const allServers: any[] = [];
    let offset = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    while (hasMore && offset < 50000) { // Safety cap at 50k
      const response = await fetch(
        `${supabaseUrl}/rest/v1/servers?select=*&limit=${batchSize}&offset=${offset}`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }

      const batch = await response.json();
      
      if (batch.length === 0) {
        hasMore = false;
      } else {
        allServers.push(...batch);
        offset += batchSize;
        
        // If we got less than batch size, we're done
        if (batch.length < batchSize) {
          hasMore = false;
        }
      }
    }

    return new Response(JSON.stringify({
      servers: allServers,
      count: allServers.length
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
      }
    });
  } catch (err) {
    console.error('Servers list error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
