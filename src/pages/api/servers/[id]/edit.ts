/**
 * Server Edit API
 * POST /api/servers/[id]/edit
 * 
 * Allows server owners to edit their server details
 * Requires authentication via email or claim token
 */

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  
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
    const body = await request.json();
    const { description, website, tags, owner_email, discord_invite } = body;
    
    // Verify the server is claimed by this email
    const verifyResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}&claimed=eq.true&select=id,claimed_by`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    if (!verifyResponse.ok) {
      throw new Error('Failed to verify server ownership');
    }
    
    const servers = await verifyResponse.json();
    if (servers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Server not found or not claimed' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const server = servers[0];
    
    // Check if the owner_email matches the claimed_by email
    if (owner_email && server.claimed_by !== owner_email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - you do not own this server' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Build update object
    const updates: any = {};
    if (description !== undefined) updates.description = description;
    if (website !== undefined) updates.website = website;
    if (tags !== undefined) updates.tags = tags;
    if (discord_invite !== undefined) updates.discord_invite = discord_invite;
    updates.updated_at = new Date().toISOString();
    
    // Update the server
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updates)
      }
    );
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Update failed: ${errorText}`);
    }
    
    // Log the edit for analytics
    await fetch(
      `${supabaseUrl}/rest/v1/server_edits`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          server_id: id,
          edited_by: owner_email,
          edited_at: new Date().toISOString(),
          changes: Object.keys(updates).filter(k => k !== 'updated_at')
        })
      }
    ).catch(() => {}); // Non-blocking
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Server updated successfully',
        updated_fields: Object.keys(updates).filter(k => k !== 'updated_at')
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
    console.error('Server edit error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update server' }),
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
