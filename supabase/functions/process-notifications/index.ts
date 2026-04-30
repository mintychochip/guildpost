// Process Pending Push Notifications
// Sends web push notifications for queued downtime alerts and other notifications

import { createClient } from 'npm:@supabase/supabase-js@2';

interface VAPIDKeys {
  publicKey: string;
  privateKey: string;
}

interface PendingNotification {
  id: string;
  subscription_id: string;
  notification_type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
}

interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

// Get VAPID keys from Supabase app_settings
async function getVAPIDKeys(supabase: ReturnType<typeof createClient>): Promise<VAPIDKeys | null> {
  const { data: publicKey, error: publicError } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'vapid_public_key')
    .single();

  const { data: privateKey, error: privateError } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'vapid_private_key')
    .single();

  if (publicError || privateError || !publicKey?.value || !privateKey?.value) {
    console.error('VAPID keys not configured');
    return null;
  }

  return {
    publicKey: publicKey.value,
    privateKey: privateKey.value
  };
}

// Send a single push notification via Web Push Protocol
async function sendPushNotification(
  subscription: PushSubscription,
  notification: PendingNotification,
  vapidKeys: VAPIDKeys
): Promise<{ success: boolean; error?: string }> {
  try {
    const pushPayload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: '/logo.svg',
      badge: '/favicon.svg',
      tag: `${notification.notification_type}-${notification.subscription_id}`,
      data: notification.data,
      requireInteraction: notification.notification_type === 'status_change',
      actions: notification.notification_type === 'status_change' 
        ? [{ action: 'view', title: 'View Server' }]
        : []
    });

    // Build VAPID JWT
    const vapidHeader = btoa(JSON.stringify({
      typ: 'JWT',
      alg: 'ES256'
    }));

    const vapidClaims = btoa(JSON.stringify({
      sub: 'mailto:admin@guildpost.tech',
      aud: new URL(subscription.endpoint).origin,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    }));

    // Note: In production, use a proper Web Push library for encryption and signing
    // This is a simplified implementation
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'TTL': '86400',
        'Urgency': notification.notification_type === 'status_change' ? 'high' : 'normal',
        'Content-Type': 'application/octet-stream',
        'Authorization': `Vapid t=${vapidHeader}.${vapidClaims}.${vapidKeys.publicKey}`
      },
      body: new TextEncoder().encode(pushPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404 || response.status === 410) {
        return { success: false, error: 'subscription_expired' };
      }
      
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error: String(error) };
  }
}

// Main handler
export async function processNotifications(request: Request): Promise<Response> {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...headers,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if downtime notifications are enabled
    const { data: setting } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'downtime_notifications_enabled')
      .single();

    if (setting?.value === 'false') {
      return new Response(
        JSON.stringify({ success: true, message: 'Downtime notifications disabled' }),
        { headers }
      );
    }

    // Get VAPID keys
    const vapidKeys = await getVAPIDKeys(supabase);
    if (!vapidKeys) {
      return new Response(
        JSON.stringify({ success: false, error: 'VAPID keys not configured' }),
        { headers, status: 503 }
      );
    }

    // Get unprocessed notifications (limit to 100 per run)
    const { data: notifications, error: fetchError } = await supabase
      .from('pending_notifications')
      .select(`
        id,
        subscription_id,
        notification_type,
        title,
        body,
        data,
        push_subscriptions!inner (
          id,
          endpoint,
          p256dh,
          auth
        )
      `)
      .is('processed_at', null)
      .order('created_at', { ascending: true })
      .limit(100);

    if (fetchError) {
      console.error('Failed to fetch pending notifications:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { headers, status: 500 }
      );
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No pending notifications' }),
        { headers }
      );
    }

    // Process notifications
    let sent = 0;
    let failed = 0;
    let expired = 0;
    const now = new Date().toISOString();

    for (const notification of notifications) {
      const sub = (notification as any).push_subscriptions;
      if (!sub) {
        console.error(`No subscription found for notification ${notification.id}`);
        failed++;
        continue;
      }

      const subscription: PushSubscription = {
        id: sub.id,
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth
      };

      const result = await sendPushNotification(subscription, notification, vapidKeys);

      // Update notification status
      await supabase
        .from('pending_notifications')
        .update({
          processed_at: now,
          delivered: result.success,
          error_message: result.error || null
        })
        .eq('id', notification.id);

      // Also log to history
      await supabase.from('push_notification_history').insert({
        subscription_id: notification.subscription_id,
        notification_type: notification.notification_type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sent_at: now,
        delivered: result.success,
        error_message: result.error || null
      });

      // Mark subscription inactive if expired
      if (result.error === 'subscription_expired') {
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false, updated_at: now })
          .eq('id', subscription.id);
        expired++;
      }

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`Processed ${notifications.length} notifications: ${sent} sent, ${failed} failed, ${expired} expired`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: notifications.length,
        sent,
        failed,
        expired
      }),
      { headers }
    );

  } catch (err) {
    console.error('Process notifications error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers, status: 500 }
    );
  }
}

// Deno serve
if (typeof Deno !== 'undefined') {
  Deno.serve(processNotifications);
}
