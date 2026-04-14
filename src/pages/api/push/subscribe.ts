import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals }) => {
  // Get client IP for rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  try {
    const body = await request.json();
    const { endpoint, p256dh, auth, subscription_type = 'all', server_id } = body;

    // Validate required fields
    if (!endpoint || !p256dh || !auth) {
      return new Response(
        JSON.stringify({ error: 'Missing required push subscription fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate subscription type
    const validTypes = ['votes', 'status', 'all'];
    if (!validTypes.includes(subscription_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid subscription type. Must be votes, status, or all' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated user
    const supabase = createClient(
      locals.runtime?.env?.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '',
      locals.runtime?.env?.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      request.headers.get('authorization')?.replace('Bearer ', '') || ''
    );

    // Allow anonymous subscriptions for server push notifications
    // But require authentication for user-specific notifications
    if (!user && !server_id) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for user notifications' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If server_id is provided, verify the user owns the server
    if (server_id && user) {
      const { data: server, error: serverError } = await supabase
        .from('servers')
        .select('owner_id')
        .eq('id', server_id)
        .single();

      if (serverError || !server || server.owner_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized to manage push notifications for this server' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for existing subscription
    const { data: existing, error: checkError } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .single();

    if (existing) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('push_subscriptions')
        .update({
          p256dh,
          auth,
          subscription_type,
          user_id: user?.id || null,
          server_id: server_id || null,
          is_active: true,
          updated_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || null
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating push subscription:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update subscription' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Subscription updated', id: existing.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert new subscription
    const { data: newSub, error: insertError } = await supabase
      .from('push_subscriptions')
      .insert({
        endpoint,
        p256dh,
        auth,
        subscription_type,
        user_id: user?.id || null,
        server_id: server_id || null,
        user_agent: request.headers.get('user-agent') || null,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (insertError) {
      // Handle duplicate key error
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Subscription already exists' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      console.error('Error creating push subscription:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create subscription' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscription created', id: newSub.id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Push subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
