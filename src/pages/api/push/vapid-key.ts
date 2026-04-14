import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

/**
 * Get VAPID public key for push notification subscription
 * This endpoint is used by the client to subscribe to push notifications
 */
export const GET: APIRoute = async ({ locals }) => {
  try {
    const supabase = createClient(
      locals.runtime?.env?.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '',
      locals.runtime?.env?.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'vapid_public_key')
      .single();

    if (error || !data?.value) {
      return new Response(
        JSON.stringify({ error: 'Push notifications not configured' }),
        { 
          status: 503, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        publicKey: data.value,
        subject: 'mailto:admin@guildpost.tech'
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching VAPID key:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
};

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};
