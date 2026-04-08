/**
 * Server Status Pinger - Cloudflare Cron Job
 * Pings all Minecraft servers and updates their status
 * 
 * Trigger: Every 5 minutes via Cloudflare Cron Triggers
 */

import type { APIRoute } from 'astro';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Server types
interface Server {
  id: string;
  ip: string;
  port: number;
  status: 'online' | 'offline' | 'unknown';
  players_online?: number;
  max_players?: number;
  last_ping_at?: string;
}

interface PingResult {
  serverId: string;
  online: boolean;
  players?: number;
  maxPlayers?: number;
  latency?: number;
  error?: string;
}

// Minecraft server ping using minecraft-server-util
async function pingServer(ip: string, port: number): Promise<PingResult> {
  try {
    // Dynamic import for Cloudflare Workers compatibility
    const { status } = await import('minecraft-server-util');
    
    const result = await status(ip, port, {
      timeout: 10000, // 10 second timeout
      enableSRV: true, // Check SRV records
    });
    
    return {
      serverId: '',
      online: true,
      players: result.players?.online || 0,
      maxPlayers: result.players?.max || 0,
      latency: result.roundTripLatency,
    };
  } catch (error: any) {
    return {
      serverId: '',
      online: false,
      error: error.message || 'Failed to ping server',
    };
  }
}

// Batch ping servers with concurrency limit
async function pingServersBatch(
  servers: Server[],
  concurrency: number = 10
): Promise<PingResult[]> {
  const results: PingResult[] = [];
  
  // Process in batches to avoid overwhelming the network
  for (let i = 0; i < servers.length; i += concurrency) {
    const batch = servers.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async (server) => {
      const result = await pingServer(server.ip, server.port);
      result.serverId = server.id;
      return result;
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // Handle rejected promise
        results.push({
          serverId: '',
          online: false,
          error: result.reason?.message || 'Unknown error',
        });
      }
    }
    
    // Small delay between batches to be nice to the network
    if (i + concurrency < servers.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

// Update servers in Supabase
async function updateServers(
  results: PingResult[],
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ updated: number; errors: number }> {
  let updated = 0;
  let errors = 0;
  const now = new Date().toISOString();
  
  // Batch update servers
  const updates = results.map(result => ({
    id: result.serverId,
    status: result.online ? 'online' : 'offline',
    players_online: result.players || 0,
    max_players: result.maxPlayers || 0,
    last_ping_at: now,
  }));
  
  // Update in batches of 100 (Supabase limit)
  const batchSize = 100;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/servers`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,merge-keys=id',
        },
        body: JSON.stringify(batch),
      });
      
      if (response.ok) {
        updated += batch.length;
      } else {
        console.error('Batch update failed:', await response.text());
        errors += batch.length;
      }
    } catch (err) {
      console.error('Update error:', err);
      errors += batch.length;
    }
  }
  
  return { updated, errors };
}

// Store ping history
async function storePingHistory(
  results: PingResult[],
  supabaseUrl: string,
  supabaseKey: string
): Promise<void> {
  const historyRecords = results
    .filter(r => r.online) // Only store successful pings
    .map(result => ({
      server_id: result.serverId,
      players_online: result.players || 0,
      max_players: result.maxPlayers || 0,
      latency_ms: result.latency || 0,
      pinged_at: new Date().toISOString(),
    }));
  
  if (historyRecords.length === 0) return;
  
  try {
    await fetch(`${supabaseUrl}/rest/v1/server_ping_history`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyRecords),
    });
  } catch (err) {
    console.error('History storage error:', err);
  }
}

// Main handler
export const GET: APIRoute = async ({ request, locals }) => {
  // Get environment
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || '';
  
  // Check for cron secret (security)
  const cronSecret = request.headers.get('X-Cron-Secret') || env.CRON_SECRET;
  const isAuthorized = !env.CRON_SECRET || cronSecret === env.CRON_SECRET;
  
  if (!isAuthorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'SUPABASE_SERVICE_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  const startTime = Date.now();
  
  try {
    // Fetch all servers
    const serversResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=id,ip,port,status&limit=10000`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );
    
    if (!serversResponse.ok) {
      throw new Error(`Failed to fetch servers: ${serversResponse.status}`);
    }
    
    const servers: Server[] = await serversResponse.json();
    
    // Ping all servers
    const pingResults = await pingServersBatch(servers, 15);
    
    // Update server statuses
    const { updated, errors } = await updateServers(pingResults, supabaseUrl, supabaseKey);
    
    // Store history
    await storePingHistory(pingResults, supabaseUrl, supabaseKey);
    
    const duration = Date.now() - startTime;
    const onlineCount = pingResults.filter(r => r.online).length;
    
    return new Response(
      JSON.stringify({
        success: true,
        serversChecked: servers.length,
        online: onlineCount,
        offline: servers.length - onlineCount,
        updated,
        errors,
        durationMs: duration,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (err: any) {
    console.error('Ping cron error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Internal error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async (context) => {
  return GET(context);
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};