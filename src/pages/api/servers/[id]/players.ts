// API route for server player count analytics
// Returns player history for dashboard charts

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  const url = new URL(request.url);
  const hours = parseInt(url.searchParams.get('hours') || '24', 10);

  const supabaseUrl = 'https://wpxutsdbiampnxfgkjwq.supabase.co';

  // Access env vars from Cloudflare Pages runtime
  const env = (locals as any)?.runtime?.env || (globalThis as any).process?.env || {};
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error - missing key' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Calculate date range
    const endTime = new Date();
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // Fetch ping history with player counts
    const response = await fetch(
      `${supabaseUrl}/rest/v1/server_ping_history?server_id=eq.${id}&created_at=gte.${startTime.toISOString()}&status=eq.online&order=created_at.asc&select=created_at,players_online`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase ping history fetch error:', response.status, errorText);
      throw new Error(`Failed to fetch player history: ${response.status}`);
    }

    const pings = await response.json();

    // Aggregate players by hour
    const hourlyData: { [hour: string]: number[] } = {};

    // Initialize all hours with empty arrays
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date(endTime);
      hourTime.setHours(hourTime.getHours() - (hours - 1 - i));
      hourTime.setMinutes(0, 0, 0);
      hourlyData[hourTime.toISOString().slice(0, 13)] = []; // YYYY-MM-DDTHH format
    }

    // Group player counts by hour
    for (const ping of pings) {
      const hour = ping.created_at.slice(0, 13); // YYYY-MM-DDTHH format
      if (hourlyData[hour] !== undefined && ping.players_online !== null) {
        hourlyData[hour].push(ping.players_online);
      }
    }

    // Calculate averages per hour
    const chartData = Object.entries(hourlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, counts]) => ({
        hour: hour + ':00:00Z',
        avg_players: counts.length > 0 ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 0,
        max_players: counts.length > 0 ? Math.max(...counts) : 0,
        min_players: counts.length > 0 ? Math.min(...counts) : 0,
        sample_count: counts.length
      }));

    // Calculate stats
    const allPlayerCounts = pings.map((p: any) => p.players_online).filter((n: number) => n !== null);
    const avgPlayers = allPlayerCounts.length > 0
      ? Math.round(allPlayerCounts.reduce((a: number, b: number) => a + b, 0) / allPlayerCounts.length)
      : 0;
    const maxPlayers = allPlayerCounts.length > 0 ? Math.max(...allPlayerCounts) : 0;
    const minPlayers = allPlayerCounts.length > 0 ? Math.min(...allPlayerCounts) : 0;
    const totalSamples = pings.length;

    // Get previous period comparison
    const prevStartTime = new Date(startTime);
    prevStartTime.setHours(prevStartTime.getHours() - hours);

    const prevResponse = await fetch(
      `${supabaseUrl}/rest/v1/server_ping_history?server_id=eq.${id}&created_at=gte.${prevStartTime.toISOString()}&created_at=lt.${startTime.toISOString()}&status=eq.online&select=players_online`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    let prevAvg = 0;
    let trend = 0;
    if (prevResponse.ok) {
      const prevPings = await prevResponse.json();
      const prevCounts = prevPings.map((p: any) => p.players_online).filter((n: number) => n !== null);
      prevAvg = prevCounts.length > 0
        ? Math.round(prevCounts.reduce((a: number, b: number) => a + b, 0) / prevCounts.length)
        : 0;
      if (prevAvg > 0) {
        trend = Math.round(((avgPlayers - prevAvg) / prevAvg) * 100);
      } else if (avgPlayers > 0) {
        trend = 100;
      }
    }

    return new Response(
      JSON.stringify({
        server_id: id,
        period: `${hours}h`,
        avg_players: avgPlayers,
        max_players: maxPlayers,
        min_players: minPlayers,
        total_samples: totalSamples,
        trend_percent: trend,
        chart_data: chartData,
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Player analytics API error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
