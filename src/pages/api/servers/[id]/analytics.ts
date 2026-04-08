/**
 * Server Analytics API
 * GET /api/servers/[id]/analytics
 * 
 * Returns vote history, view counts, player trends for server owners
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30', 10);
  const ownerEmail = url.searchParams.get('email');
  
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Verify ownership if email provided
    if (ownerEmail) {
      const verifyResponse = await fetch(
        `${supabaseUrl}/rest/v1/servers?id=eq.${id}&claimed=eq.true&claimed_by=eq.${encodeURIComponent(ownerEmail)}&select=id`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      
      if (!verifyResponse.ok) {
        throw new Error('Failed to verify ownership');
      }
      
      const servers = await verifyResponse.json();
      if (servers.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized or server not found' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch vote history
    const votesResponse = await fetch(
      `${supabaseUrl}/rest/v1/votes?server_id=eq.${id}&created_at=gte.${startDate.toISOString()}&order=created_at.desc&select=created_at,voter_ip`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    // Fetch view analytics (if table exists)
    let viewsData: any[] = [];
    try {
      const viewsResponse = await fetch(
        `${supabaseUrl}/rest/v1/server_views?server_id=eq.${id}&viewed_at=gte.${startDate.toISOString()}&order=viewed_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      if (viewsResponse.ok) {
        viewsData = await viewsResponse.json();
      }
    } catch {
      // Views table might not exist yet
    }
    
    // Fetch player history (if table exists)
    let playerHistory: any[] = [];
    try {
      const playerResponse = await fetch(
        `${supabaseUrl}/rest/v1/player_history?server_id=eq.${id}&recorded_at=gte.${startDate.toISOString()}&order=recorded_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      if (playerResponse.ok) {
        playerHistory = await playerResponse.json();
      }
    } catch {
      // Player history table might not exist yet
    }
    
    // Get current server stats
    const serverResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}&select=vote_count,players_online,max_players,avg_rating,review_count,views`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    let serverStats = {};
    if (serverResponse.ok) {
      const servers = await serverResponse.json();
      if (servers.length > 0) {
        serverStats = servers[0];
      }
    }
    
    // Process vote data into daily buckets
    const votes = votesResponse.ok ? await votesResponse.json() : [];
    const dailyVotes = new Map();
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyVotes.set(key, { date: key, votes: 0, unique_voters: new Set() });
    }
    
    // Aggregate votes
    votes.forEach((vote: any) => {
      const date = vote.created_at.split('T')[0];
      if (dailyVotes.has(date)) {
        const day = dailyVotes.get(date);
        day.votes++;
        day.unique_voters.add(vote.voter_ip);
      }
    });
    
    // Convert to array and calculate unique counts
    const voteHistory = Array.from(dailyVotes.values())
      .sort((a: any, b: any) => a.date.localeCompare(b.date))
      .map((day: any) => ({
        date: day.date,
        votes: day.votes,
        unique_voters: day.unique_voters.size
      }));
    
    // Calculate summary stats
    const totalVotes = voteHistory.reduce((sum: number, day: any) => sum + day.votes, 0);
    const avgVotesPerDay = totalVotes / days;
    const peakVotes = Math.max(...voteHistory.map((d: any) => d.votes));
    const peakDay = voteHistory.find((d: any) => d.votes === peakVotes)?.date;
    
    return new Response(
      JSON.stringify({
        success: true,
        period: { days, start: startDate.toISOString(), end: endDate.toISOString() },
        summary: {
          total_votes: totalVotes,
          avg_votes_per_day: parseFloat(avgVotesPerDay.toFixed(1)),
          peak_votes: peakVotes,
          peak_day: peakDay,
          current_rank: null // Would need to calculate from all servers
        },
        current_stats: serverStats,
        vote_history: voteHistory,
        views_count: viewsData.length,
        player_history: playerHistory.slice(0, 100) // Limit to last 100 records
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
    
  } catch (err) {
    console.error('Analytics error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch analytics' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
