// API route for server vote analytics
// Returns vote history for dashboard charts with extended time ranges

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
    
    // Aggregate votes by time interval
    const intervalData: { [key: string]: { count: number, startTime: Date } } = {};
    
    // Initialize all intervals with 0
    const numIntervals = Math.ceil(hours / intervalHours);
    for (let i = 0; i < numIntervals; i++) {
      const intervalTime = new Date(endTime);
      intervalTime.setHours(intervalTime.getHours() - ((numIntervals - 1 - i) * intervalHours));
      intervalTime.setMinutes(0, 0, 0);
      const key = formatLabel(intervalTime);
      intervalData[key] = { count: 0, startTime: intervalTime };
    }
    
    // Count votes per interval
    for (const vote of votes) {
      const voteDate = new Date(vote.voted_at);
      const key = formatLabel(voteDate);
      if (intervalData[key] !== undefined) {
        intervalData[key].count++;
      }
    }
    
    // Convert to array format for charts
    const chartData = Object.entries(intervalData)
      .sort(([a], [b]) => intervalData[a].startTime.getTime() - intervalData[b].startTime.getTime())
      .map(([key, data]) => ({
        hour: data.startTime.toISOString(),
        label: hours <= 24 
          ? data.startTime.getUTCHours() + ':00'
          : hours <= 168
            ? `${data.startTime.toISOString().slice(5, 10)} ${['00', '06', '12', '18'][Math.floor(data.startTime.getUTCHours() / 6)]}`
            : data.startTime.toISOString().slice(5, 10),
        votes: data.count
      }));
    
    // Calculate stats
    const totalVotes = votes.length;
    const avgPerHour = numIntervals > 0 ? Math.round((totalVotes / numIntervals) * 10) / 10 : 0;
    const maxInHour = Math.max(...Object.values(intervalData).map(d => d.count), 0);
    
    // Get previous period comparison
    const prevStartTime = new Date(startTime);
    prevStartTime.setHours(prevStartTime.getHours() - hours);
    
    const prevResponse = await fetch(
      `${supabaseUrl}/rest/v1/vote_history?server_id=eq.${id}&voted_at=gte.${prevStartTime.toISOString()}&voted_at=lt.${startTime.toISOString()}&select=voted_at`,
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
    
    // Calculate peak hours if requested
    let peakHoursData = null;
    if (peakHours && votes.length > 0) {
      // Group by hour of day (0-23)
      const hourOfDayData: { [hour: number]: number } = {};
      for (let i = 0; i < 24; i++) hourOfDayData[i] = 0;
      
      for (const vote of votes) {
        const hour = new Date(vote.voted_at).getUTCHours();
        hourOfDayData[hour]++;
      }
      
      peakHoursData = Object.entries(hourOfDayData).map(([hour, count]) => ({
        hour: parseInt(hour),
        hour_label: `${hour}:00 - ${hour}:59 UTC`,
        votes: count,
        percentage: votes.length > 0 ? Math.round((count / votes.length) * 100) : 0
      })).sort((a, b) => b.votes - a.votes);
    }
    
    const responseData: any = {
      server_id: id,
      period: `${hours}h`,
      period_label: hours === 24 ? '24 Hours' : hours === 168 ? '7 Days' : '30 Days',
      total_votes: totalVotes,
      avg_per_hour: avgPerHour,
      max_per_hour: maxInHour,
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
