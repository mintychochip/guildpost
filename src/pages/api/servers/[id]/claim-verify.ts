import type { APIRoute } from 'astro';
import { pingMinecraftServerAlt } from '../../../../lib/minecraft-ping';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// DNS TXT record lookup using Google DNS API
async function lookupDnsTxtRecord(domain: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=TXT`,
      { headers: { 'Accept': 'application/dns-json' } }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.Answer || !Array.isArray(data.Answer)) {
      return [];
    }
    
    // Extract TXT record values
    const txtRecords: string[] = [];
    for (const answer of data.Answer) {
      if (answer.type === 16) { // TXT record type
        // Remove quotes that DNS wraps TXT records in
        const value = answer.data.replace(/^"|"$/g, '').replace(/""/g, '"');
        txtRecords.push(value);
      }
    }
    
    return txtRecords;
  } catch (err) {
    console.error('DNS lookup error:', err);
    return [];
  }
}

// POST /api/servers/[id]/claim-verify - Verify a claim
export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  const { id } = params;
  const { claim_id, verification_method } = await request.json();
  
  if (!id || !claim_id) {
    return new Response(JSON.stringify({ error: 'Server ID and claim ID required' }), {
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
    // Get claim request
    const claimResponse = await fetch(
      `${supabaseUrl}/rest/v1/server_claims?id=eq.${encodeURIComponent(claim_id)}&server_id=eq.${encodeURIComponent(id)}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );
    
    if (!claimResponse.ok) {
      throw new Error('Failed to fetch claim');
    }
    
    const claims = await claimResponse.json();
    if (!claims || claims.length === 0) {
      return new Response(JSON.stringify({ error: 'Claim request not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const claim = claims[0];
    
    // Check if already verified or expired
    if (claim.status === 'verified') {
      return new Response(JSON.stringify({
        verified: true,
        message: 'Server already verified!',
        server_id: id,
        owner_email: claim.owner_email
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (claim.status === 'expired') {
      return new Response(JSON.stringify({
        verified: false,
        error: 'Claim request has expired. Please start a new claim.',
        expired: true
      }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if expired by time
    if (new Date(claim.expires_at) < new Date()) {
      // Update status to expired
      await fetch(`${supabaseUrl}/rest/v1/server_claims?id=eq.${claim_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'expired' })
      });
      
      return new Response(JSON.stringify({
        verified: false,
        error: 'Claim request has expired. Please start a new claim.',
        expired: true
      }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Get server details
    const serverResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(id)}&select=ip,port,name,claimed,claimed_by`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );
    
    const servers = await serverResponse.json();
    if (!servers || servers.length === 0) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const server = servers[0];
    
    // Double check not claimed by someone else
    if (server.claimed && server.claimed_by && server.claimed_by !== claim.owner_email) {
      return new Response(JSON.stringify({
        verified: false,
        error: 'Server has been claimed by another owner'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const method = verification_method || claim.verification_method;
    let verified = false;
    let verificationDetails: any = {};
    
    if (method === 'motd') {
      // Verify via MOTD
      const pingResult = await pingMinecraftServerAlt(server.ip, server.port || 25565);
      
      if (!pingResult.online) {
        const newAttempts = (claim.attempts || 0) + 1;
        await updateClaimAttempts(supabaseUrl, supabaseKey, claim_id, newAttempts, pingResult.motd || null);
        
        return new Response(JSON.stringify({
          verified: false,
          server_online: false,
          message: 'Server appears to be offline. Make sure your server is running.',
          attempts: newAttempts,
          remaining_attempts: Math.max(0, 10 - newAttempts)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const motd = pingResult.motd || '';
      const shortToken = claim.claim_token.substring(0, 8);
      
      // Check for full token or short token in MOTD
      const fullTokenFound = motd.includes(claim.claim_token);
      const shortTokenFound = motd.includes(shortToken);
      const partialMatch = motd.toLowerCase().includes(shortToken.toLowerCase());
      
      verified = fullTokenFound || shortTokenFound || partialMatch;
      
      verificationDetails = {
        method: 'motd',
        motd_preview: motd.substring(0, 200),
        token_found: fullTokenFound,
        short_token_found: shortTokenFound
      };
      
    } else if (method === 'dns') {
      // Verify via DNS TXT record
      const domain = server.ip.includes('.') ? server.ip : `${server.ip}.minecraft-server.net`;
      
      // Try main domain and _minecraft subdomain
      let txtRecords: string[] = [];
      
      // Check main domain
      txtRecords = await lookupDnsTxtRecord(domain);
      
      // If no records and domain has multiple parts, try _minecraft subdomain
      if (txtRecords.length === 0 && domain.includes('.')) {
        const minecraftDomain = `_minecraft.${domain}`;
        txtRecords = await lookupDnsTxtRecord(minecraftDomain);
      }
      
      // Check if expected TXT record exists
      const expectedValue = claim.dns_txt_record || `guildpost-verify=${claim.claim_token.substring(0, 8)}`;
      const shortToken = claim.claim_token.substring(0, 8);
      
      verified = txtRecords.some(record => 
        record.includes(expectedValue) || 
        record.includes(claim.claim_token) ||
        record.includes(shortToken) ||
        record.includes(`guildpost-verify=${shortToken}`)
      );
      
      verificationDetails = {
        method: 'dns',
        domain: domain,
        txt_records_found: txtRecords.length,
        txt_records: txtRecords.slice(0, 5), // Limit to first 5 records
        expected_value: expectedValue,
        record_found: verified
      };
    }
    
    if (verified) {
      // Update claim status to verified
      await fetch(`${supabaseUrl}/rest/v1/server_claims?id=eq.${claim_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'verified',
          verified_at: new Date().toISOString(),
          attempts: (claim.attempts || 0) + 1
        })
      });
      
      // Update server as claimed
      await fetch(`${supabaseUrl}/rest/v1/servers?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          claimed: true,
          claimed_at: new Date().toISOString(),
          claimed_by: claim.owner_email,
          claim_verification_method: method,
          verified: true,
          verified_at: new Date().toISOString(),
          verified_owner: claim.owner_email
        })
      });
      
      // Create audit log
      await fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          server_id: id,
          action: 'server_claimed',
          actor: claim.owner_email,
          details: {
            method: method,
            claim_id: claim_id,
            owner_name: claim.owner_name
          },
          created_at: new Date().toISOString()
        })
      });
      
      return new Response(JSON.stringify({
        verified: true,
        message: 'Server ownership verified successfully! You now have access to the server dashboard.',
        server_id: id,
        server_name: server.name,
        owner_email: claim.owner_email,
        verification_method: method,
        dashboard_url: `/dashboard?server=${id}&token=${claim.claim_token}`,
        verification_details: verificationDetails
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else {
      // Verification failed
      const newAttempts = (claim.attempts || 0) + 1;
      
      await fetch(`${supabaseUrl}/rest/v1/server_claims?id=eq.${claim_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attempts: newAttempts,
          last_checked: new Date().toISOString()
        })
      });
      
      let errorMessage = '';
      if (method === 'motd') {
        errorMessage = 'Verification token not found in server MOTD. Please add the token to your server.properties motd field and restart your server.';
      } else if (method === 'dns') {
        errorMessage = 'DNS TXT record not found. Please add the TXT record to your domain\'s DNS settings and wait for propagation (can take 5-30 minutes). Use: guildpost-verify=' + claim.claim_token.substring(0, 8);
      }
      
      return new Response(JSON.stringify({
        verified: false,
        message: errorMessage,
        attempts: newAttempts,
        remaining_attempts: Math.max(0, 10 - newAttempts),
        verification_details: verificationDetails
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
  } catch (err: any) {
    console.error('Claim verification error:', err);
    return new Response(JSON.stringify({ 
      verified: false,
      error: 'Failed to verify claim. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to update claim attempts
async function updateClaimAttempts(supabaseUrl: string, supabaseKey: string, claimId: string, attempts: number, lastMotd: string | null) {
  await fetch(`${supabaseUrl}/rest/v1/server_claims?id=eq.${claimId}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      attempts: attempts,
      last_checked: new Date().toISOString(),
      last_motd: lastMotd ? lastMotd.substring(0, 500) : null
    })
  });
}

// GET /api/servers/[id]/claim-verify - Check claim status
export const GET: APIRoute = async ({ params, url, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const { id } = params;
  const claimId = url.searchParams.get('claim_id');
  
  if (!id || !claimId) {
    return new Response(JSON.stringify({ error: 'Server ID and claim ID required' }), {
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
    const response = await fetch(
      `${supabaseUrl}/rest/v1/server_claims?id=eq.${encodeURIComponent(claimId)}&server_id=eq.${encodeURIComponent(id)}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      }
    );
    
    const claims = await response.json();
    
    if (!claims || claims.length === 0) {
      return new Response(JSON.stringify({ error: 'Claim not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const claim = claims[0];
    
    return new Response(JSON.stringify({
      claim_id: claim.id,
      status: claim.status,
      server_id: claim.server_id,
      owner_email: claim.owner_email,
      verification_method: claim.verification_method,
      created_at: claim.created_at,
      expires_at: claim.expires_at,
      verified_at: claim.verified_at,
      attempts: claim.attempts,
      is_expired: new Date(claim.expires_at) < new Date()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Claim status error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch claim status' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// OPTIONS handler
export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};