import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// GET /api/dashboard/servers - Get servers claimed by an owner
export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const ownerEmail = url.searchParams.get('owner_email');
  const serverId = url.searchParams.get('server_id');
  const claimToken = url.searchParams.get('token');
  
  if (!ownerEmail && !serverId) {
    return new Response(JSON.stringify({ error: 'Owner email or server ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    let queryUrl = `${supabaseUrl}/rest/v1/servers?select=*`;
    
    if (ownerEmail) {
      // Get all servers claimed by this owner
      queryUrl += `&claimed=eq.true&claimed_by=eq.${encodeURIComponent(ownerEmail)}`;
    } else if (serverId) {
      // Get specific server by ID
      queryUrl += `&id=eq.${encodeURIComponent(serverId)}`;
      
      // If claim token provided, verify it matches
      if (claimToken) {
        // Verify the claim token is valid for this server
        const claimCheckUrl = `${supabaseUrl}/rest/v1/server_claims?server_id=eq.${encodeURIComponent(serverId)}&claim_token=eq.${encodeURIComponent(claimToken)}&status=eq.verified&select=id`;
        
        const claimResponse = await fetch(claimCheckUrl, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        });
        
        if (!claimResponse.ok) {
          return new Response(JSON.stringify({ error: 'Invalid claim token' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const claims = await claimResponse.json();
        if (!claims || claims.length === 0) {
          return new Response(JSON.stringify({ error: 'Invalid or expired claim token' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    queryUrl += '&order=claimed_at.desc';
    
    const response = await fetch(queryUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch servers');
    }
    
    const servers = await response.json();
    
    // For each server, fetch additional stats
    const serversWithStats = await Promise.all(
      servers.map(async (server: any) => {
        try {
          // Fetch uptime stats
          const uptimeRes = await fetch(
            `${supabaseUrl}/rest/v1/server_uptime_stats?server_id=eq.${server.id}&select=*`,
            { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
          );
          
          const uptimeStats = uptimeRes.ok ? (await uptimeRes.json())[0] : null;
          
          // Fetch recent votes count
          const votesRes = await fetch(
            `${supabaseUrl}/rest/v1/server_votes?server_id=eq.${server.id}&select=voted_at&limit=100`,
            { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
          );
          
          const votes = votesRes.ok ? await votesRes.json() : [];
          const votesToday = votes.filter((v: any) => {
            const voteDate = new Date(v.voted_at);
            const today = new Date();
            return voteDate.toDateString() === today.toDateString();
          }).length;
          
          // Fetch recent reviews
          const reviewsRes = await fetch(
            `${supabaseUrl}/rest/v1/server_reviews?server_id=eq.${server.id}&select=rating&limit=100`,
            { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
          );
          
          const reviews = reviewsRes.ok ? await reviewsRes.json() : [];
          const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
            : null;
          
          return {
            ...server,
            uptime_stats: uptimeStats,
            votes_today: votesToday,
            total_votes_24h: votes.length,
            review_count: reviews.length,
            avg_rating: avgRating
          };
        } catch (e) {
          return server;
        }
      })
    );
    
    return new Response(JSON.stringify({
      success: true,
      servers: serversWithStats,
      count: serversWithStats.length,
      owner_email: ownerEmail
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Dashboard servers error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch servers' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// OPTIONS handler
export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};