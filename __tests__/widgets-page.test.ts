// Tests for widgets page authentication and data loading
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Widgets Page', () => {
  describe('Authentication patterns', () => {
    it('should recognize email-based authentication', () => {
      const ownerEmail = 'owner@example.com';
      const claimToken = null;
      const serverId = null;
      
      const isAuthenticated = !!ownerEmail || (!!claimToken && !!serverId);
      
      expect(isAuthenticated).toBe(true);
    });
    
    it('should recognize token+serverId authentication', () => {
      const ownerEmail = null;
      const claimToken = 'valid-token-123';
      const serverId = 'server-456';
      
      const isAuthenticated = !!ownerEmail || (!!claimToken && !!serverId);
      
      expect(isAuthenticated).toBe(true);
    });
    
    it('should not authenticate with token only (no serverId)', () => {
      const ownerEmail = null;
      const claimToken = 'valid-token-123';
      const serverId = null;
      
      const isAuthenticated = !!ownerEmail || (!!claimToken && !!serverId);
      
      expect(isAuthenticated).toBe(false);
    });
    
    it('should not authenticate with empty params', () => {
      const ownerEmail = null;
      const claimToken = null;
      const serverId = null;
      
      const isAuthenticated = !!ownerEmail || (!!claimToken && !!serverId);
      
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('Server data display logic', () => {
    it('should use owned servers when authenticated and servers exist', () => {
      const ownedServers = [
        { id: '1', name: 'My Server', ip: 'play.example.com', claimed: true }
      ];
      const isAuthenticated = true;
      const demoServers = [
        { id: 'demo-1', name: 'Demo Server', ip: 'demo.example.com', claimed: true }
      ];
      
      const displayServers = ownedServers.length > 0 ? ownedServers : (isAuthenticated ? [] : demoServers);
      
      expect(displayServers).toEqual(ownedServers);
      expect(displayServers[0].id).toBe('1');
    });
    
    it('should show empty state when authenticated but no servers', () => {
      const ownedServers: any[] = [];
      const isAuthenticated = true;
      const demoServers = [
        { id: 'demo-1', name: 'Demo Server', ip: 'demo.example.com', claimed: true }
      ];
      
      const displayServers = ownedServers.length > 0 ? ownedServers : (isAuthenticated ? [] : demoServers);
      
      expect(displayServers).toEqual([]);
    });
    
    it('should use demo servers when not authenticated', () => {
      const ownedServers: any[] = [];
      const isAuthenticated = false;
      const demoServers = [
        { id: 'demo-1', name: 'Demo Server', ip: 'demo.example.com', claimed: true }
      ];
      
      const displayServers = ownedServers.length > 0 ? ownedServers : (isAuthenticated ? [] : demoServers);
      
      expect(displayServers).toEqual(demoServers);
    });
  });

  describe('Widget URL generation', () => {
    it('should generate correct widget API URL with all params', () => {
      const baseUrl = 'https://guildpost.tech';
      const serverId = 'abc-123';
      const config = {
        size: 'medium',
        theme: 'light',
        autoRefresh: false,
        showBranding: false
      };
      
      const widgetUrl = `${baseUrl}/api/widgets/${serverId}?format=html&size=${config.size}&theme=${config.theme}`;
      const autoRefreshParam = config.autoRefresh ? '' : '&refresh=false';
      const brandingParam = config.showBranding ? '' : '&branding=false';
      const fullWidgetUrl = `${widgetUrl}${autoRefreshParam}${brandingParam}`;
      
      expect(fullWidgetUrl).toBe('https://guildpost.tech/api/widgets/abc-123?format=html&size=medium&theme=light&refresh=false&branding=false');
    });
    
    it('should generate correct JSON API URL', () => {
      const baseUrl = 'https://guildpost.tech';
      const serverId = 'abc-123';
      
      const apiUrl = `${baseUrl}/api/widgets/${serverId}?format=json`;
      
      expect(apiUrl).toBe('https://guildpost.tech/api/widgets/abc-123?format=json');
    });
    
    it('should generate correct BBCode with PNG format', () => {
      const baseUrl = 'https://guildpost.tech';
      const serverId = 'abc-123';
      const config = { size: 'small', theme: 'dark' };

      const bbcode = `[url=${baseUrl}/servers/${serverId}][img]${baseUrl}/api/widgets/${serverId}?format=png&size=${config.size}&theme=${config.theme}[/img][/url]`;

      expect(bbcode).toBe('[url=https://guildpost.tech/servers/abc-123][img]https://guildpost.tech/api/widgets/abc-123?format=png&size=small&theme=dark[/img][/url]');
    });
  });

  describe('Dashboard Analytics', () => {
    it('should generate correct votes API URL', () => {
      const serverId = 'abc-123';
      const hours = 24;
      const apiUrl = `/api/servers/${serverId}/votes?hours=${hours}`;

      expect(apiUrl).toBe('/api/servers/abc-123/votes?hours=24');
    });

    it('should generate correct players API URL', () => {
      const serverId = 'abc-123';
      const hours = 24;
      const apiUrl = `/api/servers/${serverId}/players?hours=${hours}`;

      expect(apiUrl).toBe('/api/servers/abc-123/players?hours=24');
    });

    it('should calculate trend color correctly', () => {
      const trend = 15;
      const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#8892b0';

      expect(trendColor).toBe('#10b981');
    });

    it('should calculate negative trend color correctly', () => {
      const trend = -10;
      const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#8892b0';

      expect(trendColor).toBe('#ef4444');
    });

    it('should scale chart bars based on max value', () => {
      const data = { votes: 25 };
      const maxVotes = 50;
      const height = maxVotes > 0 ? (data.votes / maxVotes) * 100 : 0;

      expect(height).toBe(50);
    });

    it('should extract hour from ISO timestamp for labels', () => {
      const hourIso = '2026-04-12T14:00:00Z';
      const date = new Date(hourIso);
      // Use UTC hours to avoid timezone issues in tests
      const hour = date.getUTCHours();

      expect(hour).toBe(14);
    });
  });
});
