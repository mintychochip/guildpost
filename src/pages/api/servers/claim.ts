import type { APIRoute } from 'astro';
import { pingMinecraftServerAlt } from '../../../lib/minecraft-ping';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Generate UUID v4 for claim tokens
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate shorter token for MOTD (first 8 chars of UUID)
function generateShortToken(): string {
  return 'GP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// POST /api/servers/claim - Start a server claim request
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { server_id, owner_email, owner_name, verification_method = 'motd' } = await request.json();
    
    if (!server_id) {
      return new Response(JSON.stringify({ error: 'Server ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!owner_email) {
      return new Response(JSON.stringify({ error: 'Owner email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(owner_email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if server exists
    const serverResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(server_id)}&select=id,name,ip,port,claimed,claimed_by`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );
    
    if (!serverResponse.ok) {
      throw new Error('Failed to fetch server');
    }
    
    const servers = await serverResponse.json();
    if (!servers || servers.length === 0) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const server = servers[0];
    
    // Check if already claimed by someone else
    if (server.claimed && server.claimed_by && server.claimed_by !== owner_email) {
      return new Response(JSON.stringify({ 
        error: 'Server already claimed by another owner',
        claimed: true,
        claimed_by: server.claimed_by
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if server is online
    const pingResult = await pingMinecraftServerAlt(server.ip, server.port || 25565);
    
    if (!pingResult.online) {
      return new Response(JSON.stringify({
        error: 'Server appears to be offline. Make sure your server is running before claiming.',
        server_online: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate claim token
    const claimToken = generateUUID();
    const shortToken = generateShortToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    // DNS TXT record format: guildpost-verify=<token>
    const dnsTxtRecord = `guildpost-verify=${shortToken}`;
    
    // Store claim request
    const claimResponse = await fetch(`${supabaseUrl}/rest/v1/server_claims`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        server_id: server_id,
        claim_token: claimToken,
        verification_method: verification_method,
        owner_email: owner_email,
        owner_name: owner_name || null,
        status: 'pending',
        dns_txt_record: verification_method === 'dns' ? dnsTxtRecord : null,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
        attempts: 0
      })
    });
    
    if (!claimResponse.ok) {
      const errorText = await claimResponse.text();
      console.error('Failed to create claim:', errorText);
      throw new Error('Failed to create claim request');
    }
    
    const claim = await claimResponse.json();
    
    // Return appropriate instructions based on verification method
    let instructions: any = {
      method: verification_method,
      token: shortToken,
      full_token: claimToken,
      expires_at: expiresAt
    };
    
    if (verification_method === 'motd') {
      instructions.motd = {
        description: 'Add this token to your server\'s MOTD in server.properties',
        example: `${pingResult.motd || 'My Server'} | Verify: ${shortToken}`,
        full_example: `motd=\\u00A7aMy Server \\u00A77| \\u00A7fVerify: ${shortToken}`,
        location: 'server.properties file',
        restart_required: true
      };
    } else if (verification_method === 'dns') {
      instructions.dns = {
        description: 'Add a TXT record to your domain\'s DNS settings',
        record_name: server.ip.includes('.') ? '_minecraft' : '@',
        record_value: dnsTxtRecord,
        example: `Type: TXT | Name: _minecraft | Value: "${dnsTxtRecord}"`,
        ttl: 300,
        propagation_time: '5-30 minutes'
      };
    }
    
    return new Response(JSON.stringify({
      success: true,
      server_id: server_id,
      server_name: server.name,
      server_ip: server.ip,
      server_port: server.port,
      claim_id: claim[0]?.id,
      claim_token: claimToken,
      owner_email: owner_email,
      verification_method: verification_method,
      instructions: instructions,
      expires_at: expiresAt,
      server_online: true,
      current_motd: pingResult.motd || null
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Claim initiation error:', err);
    return new Response(JSON.stringify({ error: 'Failed to start claim process' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// GET /api/servers/claim - Check claim status
export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const claimId = url.searchParams.get('claim_id');
  const serverId = url.searchParams.get('server_id');
  const ownerEmail = url.searchParams.get('owner_email');
  
  if (!claimId && !serverId) {
    return new Response(JSON.stringify({ error: 'Claim ID or Server ID required' }), {
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
    let queryUrl = `${supabaseUrl}/rest/v1/server_claims?select=*,servers:server_id(ip,port,name,claimed,claimed_by)`;
    
    if (claimId) {
      queryUrl += `&id=eq.${encodeURIComponent(claimId)}`;
    } else if (serverId) {
      queryUrl += `&server_id=eq.${encodeURIComponent(serverId)}`;
      if (ownerEmail) {
        queryUrl += `&owner_email=eq.${encodeURIComponent(ownerEmail)}`;
      }
      queryUrl += `&order=created_at.desc&limit=1`;
    }
    
    const response = await fetch(queryUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch claim');
    }
    
    const claims = await response.json();
    
    if (!claims || claims.length === 0) {
      return new Response(JSON.stringify({ error: 'Claim not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      claim: claims[0]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Claim status error:', err);
    return new Response(JSON.stringify({ error: 'Failed to check claim status' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// OPTIONS handler
export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};