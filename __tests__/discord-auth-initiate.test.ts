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

describe('Discord Auth Initiate API', () => {
  describe('GET /api/auth/discord/initiate', () => {
    it('should return 400 when server_id is missing', async () => {
      const mockRequest = new Request('http://localhost/api/auth/discord/initiate');
      const mockUrl = new URL('http://localhost/api/auth/discord/initiate');
      
      // Mock the module
      const { GET } = await import('../src/pages/api/auth/discord/initiate.ts');
      const response = await GET({ request: mockRequest, url: mockUrl });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing server_id parameter');
    });

    it('should return 500 when DISCORD_CLIENT_ID is not configured', async () => {
      delete process.env.DISCORD_CLIENT_ID;
      
      const mockRequest = new Request('http://localhost/api/auth/discord/initiate?server_id=abc123');
      const mockUrl = new URL('http://localhost/api/auth/discord/initiate?server_id=abc123');
      
      // Mock the module
      const { GET } = await import('../src/pages/api/auth/discord/initiate.ts');
      const response = await GET({ request: mockRequest, url: mockUrl });
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Discord OAuth not configured');
    });

    it('should encode state with serverId, redirectUrl, and timestamp as base64', async () => {
      process.env.DISCORD_CLIENT_ID = 'test-client-id';
      
      const mockRequest = new Request('http://localhost/api/auth/discord/initiate?server_id=abc123&redirect=/test');
      const mockUrl = new URL('http://localhost/api/auth/discord/initiate?server_id=abc123&redirect=/test');
      
      // Mock the module
      const { GET } = await import('../src/pages/api/auth/discord/initiate.ts');
      const response = await GET({ request: mockRequest, url: mockUrl });
      
      // Should create a redirect to Discord OAuth
      expect(response.status).toBe(302);
      
      // Check that state is properly encoded
      const location = response.headers.get('Location');
      expect(location).toContain('https://discord.com/oauth2/authorize');
      
      // Parse the state from the URL to verify it's correctly encoded
      const url = new URL(location);
      const state = url.searchParams.get('state');
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      
      expect(decodedState.serverId).toBe('abc123');
      expect(decodedState.redirectUrl).toBe('/test');
      expect(decodedState.timestamp).toBeDefined();
    });

    it('should build Discord OAuth URL with correct parameters', async () => {
      process.env.DISCORD_CLIENT_ID = 'test-client-id';
      
      const mockRequest = new Request('http://localhost/api/auth/discord/initiate?server_id=abc123&redirect=/dashboard');
      const mockUrl = new URL('http://localhost/api/auth/discord/initiate?server_id=abc123&redirect=/dashboard');
      
      // Mock the module
      const { GET } = await import('../src/pages/api/auth/discord/initiate.ts');
      const response = await GET({ request: mockRequest, url: mockUrl });
      
      // Should create a redirect to Discord OAuth
      expect(response.status).toBe(302);
      
      // Check that the redirect URL is correct
      const location = response.headers.get('Location');
      expect(location).toContain('https://discord.com/oauth2/authorize');
      expect(location).toContain('client_id=test-client-id');
      expect(location).toContain('redirect_uri=http%3A%2F%2Flocalhost%2Fapi%2Fauth%2Fdiscord%2Fcallback');
      expect(location).toContain('response_type=code');
      expect(location).toContain('scope=identify+guilds');
    });

    it('should handle OPTIONS preflight request', async () => {
      process.env.DISCORD_CLIENT_ID = 'test-client-id';
      
      const mockRequest = new Request('http://localhost/api/auth/discord/initiate', { method: 'OPTIONS' });
      const mockUrl = new URL('http://localhost/api/auth/discord/initiate');
      
      // Mock the module
      const { GET } = await import('../src/pages/api/auth/discord/initiate.ts');
      const response = await GET({ request: mockRequest, url: mockUrl });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });
});