// API route for server vote analytics
// Returns vote history for dashboard charts

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
    
    // Fetch vote history
    const response = await fetch(
      `${supabaseUrl}/rest/v1/vote_history?server_id=eq.${id}&voted_at=gte.${startTime.toISOString()}&order=voted_at.asc&select=voted_at`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase vote history fetch error:', response.status, errorText);
      throw new Error(`Failed to fetch vote history: ${response.status}`);
    }
    
    const votes = await response.json();
    
    // Aggregate votes by hour
    const hourlyData: { [hour: string]: number } = {};
    
    // Initialize all hours with 0
    for (let i = 0; i < hours; i++) {
      const hourTime = new Date(endTime);
      hourTime.setHours(hourTime.getHours() - (hours - 1 - i));
      hourTime.setMinutes(0, 0, 0);
      hourlyData[hourTime.toISOString().slice(0, 13)] = 0; // YYYY-MM-DDTHH format
    }
    
    // Count votes per hour
    for (const vote of votes) {
      const hour = vote.voted_at.slice(0, 13); // YYYY-MM-DDTHH format
      if (hourlyData[hour] !== undefined) {
        hourlyData[hour]++;
      }
    }
    
    // Convert to array format for charts
    const chartData = Object.entries(hourlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({
        hour: hour + ':00:00Z',
        votes: count
      }));
    
    // Calculate stats
    const totalVotes = votes.length;
    const avgPerHour = hours > 0 ? Math.round((totalVotes / hours) * 10) / 10 : 0;
    const maxInHour = Math.max(...Object.values(hourlyData), 0);
    
    // Get previous period comparison
    const prevStartTime = new Date(startTime);
    prevStartTime.setHours(prevStartTime.getHours() - hours);
    
    const prevResponse = await fetch(
      `${supabaseUrl}/rest/v1/vote_history?server_id=eq.${id}&voted_at=gte.${prevStartTime.toISOString()}&voted_at=lt.${startTime.toISOString()}&select=id`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    let prevTotal = 0;
    let trend = 0;
    if (prevResponse.ok) {
      const prevVotes = await prevResponse.json();
      prevTotal = prevVotes.length;
      if (prevTotal > 0) {
        trend = Math.round(((totalVotes - prevTotal) / prevTotal) * 100);
      } else if (totalVotes > 0) {
        trend = 100; // New votes when there were none before
      }
    }
    
    return new Response(
      JSON.stringify({
        server_id: id,
        period: `${hours}h`,
        total_votes: totalVotes,
        avg_per_hour: avgPerHour,
        max_per_hour: maxInHour,
        trend_percent: trend,
        chart_data: chartData,
        generated_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (err) {
    console.error('Vote analytics API error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
