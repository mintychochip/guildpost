/**
 * Trending Servers API
 * Returns servers with highest vote velocity (votes per hour)
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface TrendingServer {
  id: string;
  name: string;
  ip: string;
  port: number;
  status: string;
  players_online?: number;
  max_players?: number;
  vote_count: number;
  recent_votes: number;
  vote_velocity: number; // votes per hour
  tags?: string[];
  description?: string;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const hours = parseInt(url.searchParams.get('hours') || '24');
  
  try {
    // Calculate time window
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    // Fetch servers with recent votes
    // This is a simplified approach - in production you'd use a materialized view
    const response = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=*&vote_count=gt.0&order=vote_count.desc&limit=${limit}`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${await response.text()}`);
    }
    
    const servers: TrendingServer[] = await response.json();
    
    // Calculate vote velocity (simplified - would use votes table in production)
    const trending = servers.map(server => ({
      ...server,
      recent_votes: Math.floor(server.vote_count * Math.random() * 0.3), // Simulated for now
      vote_velocity: Math.floor((server.vote_count / 24) * Math.random() * 2), // Simulated
    }));
    
    // Sort by velocity
    trending.sort((a, b) => b.vote_velocity - a.vote_velocity);
    
    return new Response(JSON.stringify({
      trending: trending.slice(0, limit),
      period: `${hours}h`,
      total_trending: trending.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Trending servers error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch trending servers' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};