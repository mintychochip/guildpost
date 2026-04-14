/**
 * Web Push Notification Utilities for GuildPost
 * Handles VAPID keys, subscription management, and sending notifications
 */

import { createClient } from '@supabase/supabase-js';

// VAPID key interface
interface VAPIDKeys {
  publicKey: string;
  privateKey: string;
}

// Push subscription from database
interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_id?: string;
  server_id?: number;
  subscription_type: 'votes' | 'status' | 'all';
}

// Notification payload
interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

/**
 * Get VAPID keys from Supabase app_settings
 */
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

/**
 * Send a push notification to a single subscription
 */
async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload,
  vapidKeys: VAPIDKeys
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build the push message payload
    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/logo.svg',
      badge: payload.badge || '/favicon.svg',
      tag: payload.tag || 'guildpost-notification',
      data: payload.data || {},
      requireInteraction: payload.requireInteraction || false,
      actions: payload.actions || []
    });

    // Create the encrypted payload
    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };

    // Send via Web Push Protocol
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '60',
        'Urgency': 'normal',
        'Authorization': `vapid t=${Buffer.from(JSON.stringify({
          sub: 'mailto:admin@guildpost.tech',
          exp: Math.floor(Date.now() / 1000) + 3600
        })).toString('base64url')}.${Buffer.from(vapidKeys.publicKey).toString('base64url')}`
      },
      body: await encryptPayload(pushPayload, subscriptionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Handle expired subscription
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

/**
 * Encrypt payload using Web Push encryption (simplified)
 * In production, use web-push library for proper encryption
 */
async function encryptPayload(
  payload: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<ArrayBuffer> {
  // This is a placeholder - in production, use the web-push library
  // or implement proper ECE (Encrypted Content-Encoding) encryption
  const encoder = new TextEncoder();
  return encoder.encode(payload).buffer as ArrayBuffer;
}

/**
 * Send notification for a vote event
 */
export async function sendVoteNotification(
  supabase: ReturnType<typeof createClient>,
  serverId: number,
  serverName: string,
  voteCount: number,
  voterUsername?: string
): Promise<{ sent: number; failed: number }> {
  const vapidKeys = await getVAPIDKeys(supabase);
  if (!vapidKeys) {
    return { sent: 0, failed: 0 };
  }

  // Get subscriptions for this server that want vote notifications
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('server_id', serverId)
    .eq('is_active', true)
    .or('subscription_type.eq.votes,subscription_type.eq.all');

  if (error || !subscriptions || subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;
  const now = new Date().toISOString();

  for (const sub of subscriptions) {
    const voterText = voterUsername ? ` by ${voterUsername}` : '';
    const result = await sendPushNotification(
      sub,
      {
        title: `New Vote on ${serverName}`,
        body: `Your server received a new vote${voterText}! Total votes: ${voteCount.toLocaleString()}`,
        icon: '/logo.svg',
        badge: '/favicon.svg',
        tag: `vote-${serverId}`,
        data: {
          type: 'vote',
          serverId,
          voteCount,
          url: `/servers/${serverId}`
        },
        requireInteraction: false
      },
      vapidKeys
    );

    // Log the attempt
    await supabase.from('push_notification_history').insert({
      subscription_id: sub.id,
      notification_type: 'vote',
      title: `New Vote on ${serverName}`,
      body: `Your server received a new vote${voterText}!`,
      data: { serverId, voteCount },
      sent_at: now,
      delivered: result.success,
      error_message: result.error || null
    });

    // Mark inactive if subscription expired
    if (result.error === 'subscription_expired') {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false, updated_at: now })
        .eq('id', sub.id);
    }

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Send notification for server status change
 */
export async function sendStatusChangeNotification(
  supabase: ReturnType<typeof createClient>,
  serverId: number,
  serverName: string,
  isOnline: boolean,
  playerCount?: number
): Promise<{ sent: number; failed: number }> {
  const vapidKeys = await getVAPIDKeys(supabase);
  if (!vapidKeys) {
    return { sent: 0, failed: 0 };
  }

  // Get subscriptions for this server that want status notifications
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('server_id', serverId)
    .eq('is_active', true)
    .or('subscription_type.eq.status,subscription_type.eq.all');

  if (error || !subscriptions || subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;
  const now = new Date().toISOString();

  const statusText = isOnline ? 'online' : 'offline';
  const playerText = isOnline && playerCount !== undefined 
    ? ` (${playerCount} players online)` 
    : '';

  for (const sub of subscriptions) {
    const result = await sendPushNotification(
      sub,
      {
        title: `${serverName} is ${statusText}`,
        body: `Your server went ${statusText}${playerText}`,
        icon: '/logo.svg',
        badge: '/favicon.svg',
        tag: `status-${serverId}`,
        data: {
          type: 'status_change',
          serverId,
          isOnline,
          playerCount,
          url: `/servers/${serverId}`
        },
        requireInteraction: false
      },
      vapidKeys
    );

    // Log the attempt
    await supabase.from('push_notification_history').insert({
      subscription_id: sub.id,
      notification_type: 'status_change',
      title: `${serverName} is ${statusText}`,
      body: `Your server went ${statusText}${playerText}`,
      data: { serverId, isOnline, playerCount },
      sent_at: now,
      delivered: result.success,
      error_message: result.error || null
    });

    // Mark inactive if subscription expired
    if (result.error === 'subscription_expired') {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false, updated_at: now })
        .eq('id', sub.id);
    }

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Get VAPID public key for client-side use
 */
export async function getVapidPublicKey(
  supabase: ReturnType<typeof createClient>
): Promise<string | null> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'vapid_public_key')
    .single();

  if (error || !data?.value) {
    return null;
  }

  return data.value;
}

/**
 * Generate new VAPID keys
 * Note: Should only be called during initial setup or key rotation
 */
export async function generateVAPIDKeys(): Promise<VAPIDKeys> {
  // In production, use the web-push library's generateVAPIDKeys()
  // For now, return placeholder - keys should be generated using:
  // const webpush = require('web-push');
  // const vapidKeys = webpush.generateVAPIDKeys();
  
  throw new Error('VAPID keys must be generated using web-push library CLI or admin script');
}
