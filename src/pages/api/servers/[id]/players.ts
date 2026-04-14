// API route for server player count analytics
// Returns player history for dashboard charts with extended time ranges

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Valid time ranges
const VALID_HOURS = [24, 168, 720]; // 1 day, 7 days, 30 days

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  const url = new URL(request.url);
  let hours = parseInt(url.searchParams.get('hours') || '24', 10);
  
  // Validate hours parameter
  if (!VALID_HOURS.includes(hours)) {
    hours = 24; // Default to 24h if invalid
  }
  
  // Check for peak hours analysis request
  const peakHours = url.searchParams.get('peak_hours') === 'true';

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

    // Calculate time grouping interval based on hours
    // For 24h: group by hour
    // For 168h (7d): group by 6-hour blocks
    // For 720h (30d): group by day
    let intervalHours = 1;
    let formatLabel: (date: Date) => string;
    
    if (hours <= 24) {
      intervalHours = 1;
      formatLabel = (d) => d.toISOString().slice(0, 13); // YYYY-MM-DDTHH
    } else if (hours <= 168) {
      intervalHours = 6;
      formatLabel = (d) => {
        const day = d.toISOString().slice(0, 10);
        const block = Math.floor(d.getUTCHours() / 6);
        return `${day}-B${block}`;
      };
    } else {
      intervalHours = 24;
      formatLabel = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    // Aggregate players by time interval
    const intervalData: { [key: string]: { counts: number[], startTime: Date } } = {};

    // Initialize all intervals with empty arrays
    const numIntervals = Math.ceil(hours / intervalHours);
    for (let i = 0; i < numIntervals; i++) {
      const intervalTime = new Date(endTime);
      intervalTime.setHours(intervalTime.getHours() - ((numIntervals - 1 - i) * intervalHours));
      intervalTime.setMinutes(0, 0, 0);
      const key = formatLabel(intervalTime);
      intervalData[key] = { counts: [], startTime: intervalTime };
    }

    // Group player counts by interval
    for (const ping of pings) {
      const pingDate = new Date(ping.created_at);
      const key = formatLabel(pingDate);
      if (intervalData[key] !== undefined && ping.players_online !== null) {
        intervalData[key].counts.push(ping.players_online);
      }
    }

    // Calculate averages per interval
    const chartData = Object.entries(intervalData)
      .sort(([a], [b]) => intervalData[a].startTime.getTime() - intervalData[b].startTime.getTime())
      .map(([key, data]) => ({
        hour: data.startTime.toISOString(),
        label: hours <= 24 
          ? data.startTime.getUTCHours() + ':00'
          : hours <= 168
            ? `${data.startTime.toISOString().slice(5, 10)} ${['00', '06', '12', '18'][Math.floor(data.startTime.getUTCHours() / 6)]}`
            : data.startTime.toISOString().slice(5, 10),
        avg_players: data.counts.length > 0 ? Math.round(data.counts.reduce((a, b) => a + b, 0) / data.counts.length) : 0,
        max_players: data.counts.length > 0 ? Math.max(...data.counts) : 0,
        min_players: data.counts.length > 0 ? Math.min(...data.counts) : 0,
        sample_count: data.counts.length
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

    // Calculate peak hours if requested
    let peakHoursData = null;
    if (peakHours && allPlayerCounts.length > 0) {
      // Group by hour of day (0-23)
      const hourOfDayData: { [hour: number]: number[] } = {};
      for (let i = 0; i < 24; i++) hourOfDayData[i] = [];
      
      for (const ping of pings) {
        const hour = new Date(ping.created_at).getUTCHours();
        if (ping.players_online !== null) {
          hourOfDayData[hour].push(ping.players_online);
        }
      }
      
      peakHoursData = Object.entries(hourOfDayData).map(([hour, counts]) => ({
        hour: parseInt(hour),
        hour_label: `${hour}:00 - ${hour}:59 UTC`,
        avg_players: counts.length > 0 ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 0,
        max_players: counts.length > 0 ? Math.max(...counts) : 0,
        total_samples: counts.length
      })).sort((a, b) => b.avg_players - a.avg_players);
    }

    const responseData: any = {
      server_id: id,
      period: `${hours}h`,
      period_label: hours === 24 ? '24 Hours' : hours === 168 ? '7 Days' : '30 Days',
      avg_players: avgPlayers,
      max_players: maxPlayers,
      min_players: minPlayers,
      total_samples: totalSamples,
      trend_percent: trend,
      chart_data: chartData,
      generated_at: new Date().toISOString()
    };
    
    if (peakHoursData) {
      responseData.peak_hours = peakHoursData.slice(0, 6); // Top 6 peak hours
    }

    return new Response(
      JSON.stringify(responseData),
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
