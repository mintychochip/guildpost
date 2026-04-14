import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { endpoint, subscription_id } = body;

    // Must provide either endpoint or subscription_id
    if (!endpoint && !subscription_id) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint or subscription_id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      locals.runtime?.env?.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '',
      locals.runtime?.env?.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
    );

    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('authorization')?.replace('Bearer ', '') || ''
    );

    // Build the query
    let query = supabase.from('push_subscriptions').select('*');
    
    if (subscription_id) {
      query = query.eq('id', subscription_id);
    } else {
      query = query.eq('endpoint', endpoint);
    }

    // If user is authenticated, ensure they can only delete their own subscriptions
    if (user) {
      query = query.or(`user_id.eq.${user.id},server_id.in.(select id from servers where owner_id = ${user.id})`);
    }

    const { data: subscription, error: fetchError } = await query.single();

    if (fetchError || !subscription) {
      return new Response(
        JSON.stringify({ error: 'Subscription not found or unauthorized' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Soft delete - mark as inactive
    const { error: updateError } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error deactivating subscription:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to unsubscribe' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully unsubscribed' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
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
