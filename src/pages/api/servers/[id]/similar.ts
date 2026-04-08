/**
 * Similar Servers API
 * Returns servers with similar tags to the given server
 * GET /api/servers/[id]/similar?limit=5
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const GET: APIRoute = async ({ params, url, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const { id } = params;
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '4'), 10);
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Server ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // First, get the server's tags
    const serverRes = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}&select=tags`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!serverRes.ok) throw new Error('Failed to fetch server');
    const servers = await serverRes.json();
    
    if (!servers.length || !servers[0].tags?.length) {
      return new Response(JSON.stringify({
        server_id: id,
        similar: [],
        message: 'No tags found for this server'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Use first tag to find similar servers
    const primaryTag = servers[0].tags[0];
    
    // Find servers with same tag, excluding current
    const similarRes = await fetch(
      `${supabaseUrl}/rest/v1/servers?` +
      `select=id,name,ip,port,status,players_online,max_players,vote_count,tags&` +
      `tags=cs.{${primaryTag}}&` +
      `id=neq.${id}&` +
      `status=eq.online&` +
      `limit=${limit}`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!similarRes.ok) throw new Error('Failed to fetch similar servers');
    const similar = await similarRes.json();
    
    return new Response(JSON.stringify({
      server_id: id,
      primary_tag: primaryTag,
      similar: similar || [],
      count: similar?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Similar servers error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch similar servers' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};