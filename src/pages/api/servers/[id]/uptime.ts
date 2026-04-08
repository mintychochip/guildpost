/**
 * Server Uptime API
 * Returns historical uptime data and statistics
 * GET /api/servers/[id]/uptime?days=30
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
  const days = parseInt(url.searchParams.get('days') || '7');
  
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
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch ping history
    const response = await fetch(
      `${supabaseUrl}/rest/v1/server_ping_history?` +
      `select=pinged_at,players_online,max_players,latency_ms&` +
      `server_id=eq.${id}&` +
      `pinged_at=gte.${since}&` +
      `order=pinged_at.asc&` +
      `limit=10000`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${await response.text()}`);
    }
    
    const pings = await response.json();
    
    // Calculate uptime stats
    const totalPings = pings.length;
    const onlinePings = pings.filter((p: any) => p.players_online > 0).length;
    const uptimePercentage = totalPings > 0 ? Math.round((onlinePings / totalPings) * 100) : 0;
    
    // Calculate averages
    const avgPlayers = totalPings > 0 
      ? Math.round(pings.reduce((sum: number, p: any) => sum + (p.players_online || 0), 0) / totalPings)
      : 0;
    
    const avgLatency = totalPings > 0
      ? Math.round(pings.reduce((sum: number, p: any) => sum + (p.latency_ms || 0), 0) / totalPings)
      : 0;
    
    // Group by day for chart
    const dailyStats: Record<string, { pings: number; online: number; avgPlayers: number }> = {};
    
    pings.forEach((ping: any) => {
      const day = ping.pinged_at.split('T')[0];
      if (!dailyStats[day]) {
        dailyStats[day] = { pings: 0, online: 0, avgPlayers: 0 };
      }
      dailyStats[day].pings++;
      if (ping.players_online > 0) dailyStats[day].online++;
      dailyStats[day].avgPlayers += ping.players_online || 0;
    });
    
    // Format for chart
    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      uptime: stats.pings > 0 ? Math.round((stats.online / stats.pings) * 100) : 0,
      avg_players: Math.round(stats.avgPlayers / stats.pings)
    }));
    
    return new Response(JSON.stringify({
      server_id: id,
      period_days: days,
      uptime: {
        percentage: uptimePercentage,
        total_checks: totalPings,
        online_checks: onlinePings,
        offline_checks: totalPings - onlinePings
      },
      averages: {
        players_online: avgPlayers,
        latency_ms: avgLatency
      },
      chart_data: chartData,
      raw_data: pings.slice(-288) // Last 24h of pings (5min intervals)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Uptime API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch uptime data' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};