import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

const originalEnv = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Discord Verify Status API', () => {
  describe('GET /api/discord/verify-status', () => {
    it('should return verification status for a verified server', async () => {
      const mockData = [{
        discord_verified: true,
        discord_guild_id: '123456789',
        discord_guild_name: 'Test Guild',
        discord_verified_at: '2024-01-15T10:30:00Z',
      }];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=abc123');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=abc123') });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.verified).toBe(true);
      expect(data.guildId).toBe('123456789');
      expect(data.guildName).toBe('Test Guild');
      expect(data.verifiedAt).toBe('2024-01-15T10:30:00Z');
    });

    it('should return unverified status for non-verified server', async () => {
      const mockData = [{
        discord_verified: false,
        discord_guild_id: null,
        discord_guild_name: null,
        discord_verified_at: null,
      }];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=unverified123');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=unverified123') });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.verified).toBe(false);
      expect(data.guildId).toBeNull();
      expect(data.guildName).toBeNull();
      expect(data.verifiedAt).toBeNull();
    });

    it('should return 400 when server_id is missing', async () => {
      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status') });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing server_id parameter');
    });

    it('should return 404 when server is not found', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=nonexistent');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=nonexistent') });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Server not found');
    });

    it('should return 500 when Supabase API fails', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response);

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=abc123');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=abc123') });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch verification status');
    });

    it('should return 500 on internal error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=abc123');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=abc123') });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    it('should handle OPTIONS preflight request', async () => {
      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status', { method: 'OPTIONS' });
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status') });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });

    it('should include CORS headers on all responses', async () => {
      const mockData = [{
        discord_verified: true,
        discord_guild_id: '123',
        discord_guild_name: 'Test',
        discord_verified_at: null,
      }];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=abc123');
      const response = await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=abc123') });

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should use default Supabase URL when env var is not set', async () => {
      const mockData = [{
        discord_verified: true,
        discord_guild_id: '123',
        discord_guild_name: 'Test',
        discord_verified_at: null,
      }];

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      delete process.env.SUPABASE_URL;
      process.env.SUPABASE_SERVICE_KEY = 'test-key';

      const { GET } = await import('../src/pages/api/discord/verify-status.ts');
      const request = new Request('http://localhost/api/discord/verify-status?server_id=abc123');
      await GET({ request, url: new URL('http://localhost/api/discord/verify-status?server_id=abc123') });

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(fetchCall[0]).toContain('wpxutsdbiampnxfgkjwq.supabase.co');
    });
  });
});
