/**
 * Global Stats API
 * Returns GuildPost ecosystem statistics
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get total servers
    const serversResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=count`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    const serversData = await serversResponse.json();
    const totalServers = serversData[0]?.count || 0;
    
    // Get online servers
    const onlineResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=count&status=eq.online`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    const onlineData = await onlineResponse.json();
    const onlineServers = onlineData[0]?.count || 0;
    
    // Get total players online
    const playersResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=players_online&status=eq.online&players_online=gt.0&limit=10000`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    const playersData = await playersResponse.json();
    const totalPlayers = playersData.reduce((sum: number, s: any) => sum + (s.players_online || 0), 0);
    
    // Get total votes
    const votesResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=vote_count&limit=10000`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    const votesData = await votesResponse.json();
    const totalVotes = votesData.reduce((sum: number, s: any) => sum + (s.vote_count || 0), 0);
    
    // Get votes today (if votes table exists with timestamps)
    let votesToday = 0;
    try {
      const today = new Date().toISOString().split('T')[0];
      const votesTodayResponse = await fetch(
        `${supabaseUrl}/rest/v1/votes?select=count&created_at=gte.${today}`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
      );
      if (votesTodayResponse.ok) {
        const votesTodayData = await votesTodayResponse.json();
        votesToday = votesTodayData[0]?.count || 0;
      }
    } catch {
      // Votes table might not exist yet
    }
    
    // Get popular tags
    const tagsResponse = await fetch(
      `${supabaseUrl}/rpc/get_popular_tags?limit=10`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    let popularTags = [];
    if (tagsResponse.ok) {
      popularTags = await tagsResponse.json();
    }
    
    return new Response(JSON.stringify({
      total_servers: totalServers,
      online_servers: onlineServers,
      offline_servers: totalServers - onlineServers,
      total_players_online: totalPlayers,
      total_votes: totalVotes,
      votes_today: votesToday,
      popular_tags: popularTags,
      last_updated: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Global stats error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};