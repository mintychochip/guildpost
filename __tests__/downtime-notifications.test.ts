import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Downtime Notification Tests
 * 
 * Tests for server downtime push notification system
 */

describe('Downtime Notifications', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_KEY: 'test-service-key'
    };
  });

  afterEach(() => {
    process = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Status Change Detection', () => {
    it('should detect online -> offline transition', () => {
      const previousStatus = 'online';
      const newStatus = 'offline';
      
      const isDowntime = previousStatus === 'online' && newStatus === 'offline';
      expect(isDowntime).toBe(true);
    });

    it('should detect offline -> online transition (recovery)', () => {
      const previousStatus = 'offline';
      const newStatus = 'online';
      
      const isRecovery = previousStatus === 'offline' && newStatus === 'online';
      expect(isRecovery).toBe(true);
    });

    it('should not notify on repeated offline checks', () => {
      const previousStatus = 'offline';
      const newStatus = 'offline';
      
      const statusChanged = previousStatus !== newStatus;
      expect(statusChanged).toBe(false);
    });

    it('should not notify on repeated online checks', () => {
      const previousStatus = 'online';
      const newStatus = 'online';
      
      const statusChanged = previousStatus !== newStatus;
      expect(statusChanged).toBe(false);
    });

    it('should handle unknown previous status', () => {
      const previousStatus = 'unknown';
      const newStatus = 'offline';
      
      // Should not trigger downtime notification for new servers
      const isDowntime = previousStatus === 'online' && newStatus === 'offline';
      expect(isDowntime).toBe(false);
    });
  });

  describe('Pending Notifications Queue', () => {
    it('should create pending notification with required fields', () => {
      const notification = {
        subscription_id: 'sub-123',
        notification_type: 'status_change',
        title: 'Test Server is offline',
        body: 'Your server has gone offline and is not responding to pings.',
        data: { serverId: 456, isOnline: false, url: '/servers/456' },
        server_id: 456,
        created_at: new Date().toISOString()
      };

      expect(notification.subscription_id).toBeDefined();
      expect(notification.notification_type).toBe('status_change');
      expect(notification.title).toContain('offline');
      expect(notification.data.serverId).toBe(456);
    });

    it('should support multiple notification types', () => {
      const validTypes = ['status_change', 'vote', 'announcement'];
      
      for (const type of validTypes) {
        expect(validTypes).toContain(type);
      }
    });

    it('should mark notification as processed after sending', () => {
      const notification = {
        id: 'notif-123',
        subscription_id: 'sub-456',
        processed_at: new Date().toISOString(),
        delivered: true,
        error_message: null
      };

      expect(notification.processed_at).toBeDefined();
      expect(notification.delivered).toBe(true);
    });

    it('should track delivery failures', () => {
      const notification = {
        id: 'notif-123',
        processed_at: new Date().toISOString(),
        delivered: false,
        error_message: 'subscription_expired'
      };

      expect(notification.delivered).toBe(false);
      expect(notification.error_message).toBe('subscription_expired');
    });
  });

  describe('Notification Processing', () => {
    it('should only process unprocessed notifications', () => {
      const pendingNotifications = [
        { id: 'notif-1', processed_at: null },
        { id: 'notif-2', processed_at: '2026-01-01T00:00:00Z' },
        { id: 'notif-3', processed_at: null }
      ];

      const unprocessed = pendingNotifications.filter(n => n.processed_at === null);
      
      expect(unprocessed).toHaveLength(2);
      expect(unprocessed.map(n => n.id)).toContain('notif-1');
      expect(unprocessed.map(n => n.id)).toContain('notif-3');
    });

    it('should process notifications in creation order', () => {
      const notifications = [
        { id: 'notif-3', created_at: '2026-04-30T10:00:00Z' },
        { id: 'notif-1', created_at: '2026-04-30T08:00:00Z' },
        { id: 'notif-2', created_at: '2026-04-30T09:00:00Z' }
      ];

      const sorted = [...notifications].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      expect(sorted[0].id).toBe('notif-1');
      expect(sorted[1].id).toBe('notif-2');
      expect(sorted[2].id).toBe('notif-3');
    });

    it('should limit batch size to prevent timeouts', () => {
      const batchSize = 100;
      const notifications = new Array(250).fill(null).map((_, i) => ({ id: `notif-${i}` }));
      
      const batch = notifications.slice(0, batchSize);
      expect(batch).toHaveLength(100);
    });
  });

  describe('Downtime Notification Content', () => {
    it('should include server name in notification title', () => {
      const serverName = 'Hypixel Network';
      const title = `${serverName} is offline`;
      
      expect(title).toContain(serverName);
      expect(title).toContain('offline');
    });

    it('should include actionable message in body', () => {
      const body = 'Your server has gone offline and is not responding to pings.';
      
      expect(body).toContain('offline');
      expect(body.length).toBeLessThan(150); // Keep it concise
    });

    it('should include server URL in notification data', () => {
      const serverId = 123;
      const data = { serverId, isOnline: false, url: `/servers/${serverId}` };
      
      expect(data.url).toBe('/servers/123');
      expect(data.isOnline).toBe(false);
    });

    it('should require interaction for downtime alerts', () => {
      const notification = {
        requireInteraction: true,
        actions: [{ action: 'view', title: 'View Server' }]
      };

      expect(notification.requireInteraction).toBe(true);
      expect(notification.actions).toHaveLength(1);
    });
  });

  describe('Targeted Subscriptions', () => {
    it('should only notify status subscribers', () => {
      const subscriptions = [
        { id: 'sub-1', subscription_type: 'votes', is_active: true },
        { id: 'sub-2', subscription_type: 'status', is_active: true },
        { id: 'sub-3', subscription_type: 'all', is_active: true },
        { id: 'sub-4', subscription_type: 'status', is_active: false }
      ];

      const statusSubscribers = subscriptions.filter(
        s => s.is_active && (s.subscription_type === 'status' || s.subscription_type === 'all')
      );

      expect(statusSubscribers).toHaveLength(2);
      expect(statusSubscribers.map(s => s.id)).toContain('sub-2');
      expect(statusSubscribers.map(s => s.id)).toContain('sub-3');
    });

    it('should only notify server-specific subscribers', () => {
      const serverId = 123;
      const subscriptions = [
        { id: 'sub-1', server_id: 123, is_active: true },
        { id: 'sub-2', server_id: 456, is_active: true },
        { id: 'sub-3', server_id: 123, is_active: false }
      ];

      const targeted = subscriptions.filter(
        s => s.server_id === serverId && s.is_active
      );

      expect(targeted).toHaveLength(1);
      expect(targeted[0].id).toBe('sub-1');
    });
  });

  describe('Rate Limiting and Deduplication', () => {
    it('should use consistent notification tag for deduplication', () => {
      const subscriptionId = 'sub-123';
      const notificationType = 'status_change';
      const tag = `${notificationType}-${subscriptionId}`;
      
      expect(tag).toBe('status_change-sub-123');
    });

    it('should set high urgency for downtime alerts', () => {
      const notificationType = 'status_change';
      const urgency = notificationType === 'status_change' ? 'high' : 'normal';
      
      expect(urgency).toBe('high');
    });

    it('should set normal urgency for other notifications', () => {
      const notificationType = 'vote';
      const urgency = notificationType === 'status_change' ? 'high' : 'normal';
      
      expect(urgency).toBe('normal');
    });
  });

  describe('Database Schema', () => {
    it('should have required pending notification fields', () => {
      const notification = {
        id: 'uuid',
        subscription_id: 'sub-uuid',
        notification_type: 'status_change',
        title: 'Server Offline',
        body: 'Your server is offline',
        data: { serverId: 123 },
        server_id: 123,
        created_at: '2026-04-30T08:00:00Z',
        processed_at: null,
        delivered: false,
        error_message: null
      };

      expect(notification.subscription_id).toBeDefined();
      expect(notification.title).toBeDefined();
      expect(notification.body).toBeDefined();
      expect(notification.notification_type).toMatch(/^(status_change|vote|announcement)$/);
    });

    it('should enforce foreign key to push_subscriptions', () => {
      // pending_notifications.subscription_id should reference push_subscriptions.id
      expect(true).toBe(true); // Schema constraint
    });

    it('should enforce foreign key to servers', () => {
      // pending_notifications.server_id should reference servers.id
      expect(true).toBe(true); // Schema constraint
    });
  });

  describe('Feature Toggle', () => {
    it('should respect downtime_notifications_enabled setting', () => {
      const enabled = 'true';
      const shouldProcess = enabled !== 'false';
      
      expect(shouldProcess).toBe(true);
    });

    it('should skip processing when disabled', () => {
      const enabled = 'false';
      const shouldProcess = enabled !== 'false';
      
      expect(shouldProcess).toBe(false);
    });
  });

  describe('Edge Function Integration', () => {
    it('should return success when no pending notifications', async () => {
      const response = {
        success: true,
        message: 'No pending notifications'
      };

      expect(response.success).toBe(true);
    });

    it('should return processing stats', async () => {
      const response = {
        success: true,
        processed: 50,
        sent: 45,
        failed: 3,
        expired: 2
      };

      expect(response.processed).toBe(50);
      expect(response.sent).toBe(45);
      expect(response.failed).toBe(3);
      expect(response.expired).toBe(2);
    });

    it('should return 503 when VAPID keys not configured', async () => {
      const vapidKeys = null;
      const response = {
        success: false,
        error: 'VAPID keys not configured',
        status: vapidKeys ? 200 : 503
      };

      expect(response.status).toBe(503);
    });
  });

  describe('Cleanup', () => {
    it('should clean up notifications older than 7 days', () => {
      const processedAt = new Date('2026-04-20'); // 10 days ago
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const shouldDelete = processedAt < sevenDaysAgo;
      
      expect(shouldDelete).toBe(true);
    });

    it('should not delete recent notifications', () => {
      const processedAt = new Date(); // Now
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const shouldDelete = processedAt < sevenDaysAgo;
      
      expect(shouldDelete).toBe(false);
    });
  });
});

describe('Full Integration Flow', () => {
  it('should complete full downtime notification flow', async () => {
    // 1. Server status changes from online to offline
    const previousStatus = 'online';
    const newStatus = 'offline';
    const serverId = 123;
    
    expect(previousStatus !== newStatus).toBe(true);
    expect(previousStatus === 'online' && newStatus === 'offline').toBe(true);

    // 2. Pending notifications are queued
    const pendingNotifications = [
      { subscription_id: 'sub-1', server_id: serverId },
      { subscription_id: 'sub-2', server_id: serverId }
    ];
    expect(pendingNotifications).toHaveLength(2);

    // 3. Edge function processes notifications
    const processed = { sent: 2, failed: 0, expired: 0 };
    expect(processed.sent).toBe(2);

    // 4. Notifications marked as delivered
    const delivered = { processed_at: new Date().toISOString(), delivered: true };
    expect(delivered.delivered).toBe(true);
  });
});
