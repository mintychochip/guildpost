import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Players API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.stubGlobal('process', { env: {} });
  });

  describe('GET /api/servers/[id]/players', () => {
    it('should return player analytics with hourly chart data', async () => {
      const now = new Date('2026-04-13T12:00:00Z');
      vi.setSystemTime(now);

      const mockPings = [
        { created_at: '2026-04-13T11:30:00Z', players_online: 45 },
        { created_at: '2026-04-13T11:45:00Z', players_online: 50 },
        { created_at: '2026-04-13T10:15:00Z', players_online: 35 },
        { created_at: '2026-04-13T10:45:00Z', players_online: 40 },
      ];

      const mockPrevPings = [
        { players_online: 30 },
        { players_online: 32 },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPrevPings),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server-123' },
        request: { url: 'http://localhost/api/servers/test-server-123/players?hours=4' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.server_id).toBe('test-server-123');
      expect(data.period).toBe('4h');
      expect(data.avg_players).toBe(43); // (45+50+35+40) / 4 = 42.5, rounded
      expect(data.max_players).toBe(50);
      expect(data.min_players).toBe(35);
      expect(data.total_samples).toBe(4);
      expect(data.chart_data).toBeDefined();
      expect(Array.isArray(data.chart_data)).toBe(true);
      expect(data.generated_at).toBeDefined();
    });

    it('should default to 24 hours when no hours parameter provided', async () => {
      const mockPings = [{ created_at: '2026-04-13T10:00:00Z', players_online: 25 }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.period).toBe('24h');
    });

    it('should calculate trend percentage correctly', async () => {
      const mockPings = [
        { created_at: '2026-04-13T10:00:00Z', players_online: 100 },
        { created_at: '2026-04-13T11:00:00Z', players_online: 100 },
      ];

      const mockPrevPings = [
        { players_online: 50 },
        { players_online: 50 },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPrevPings),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players?hours=2' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      const data = await response.json();
      // Current avg = 100, previous avg = 50, trend = ((100-50)/50) * 100 = 100%
      expect(data.trend_percent).toBe(100);
    });

    it('should handle zero previous period players', async () => {
      const mockPings = [
        { created_at: '2026-04-13T10:00:00Z', players_online: 25 },
      ];

      const mockPrevPings: any[] = []; // Empty previous period

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPrevPings),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'new-server' },
        request: { url: 'http://localhost/api/servers/new-server/players?hours=1' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      const data = await response.json();
      expect(data.avg_players).toBe(25);
      // When prev avg is 0 and current > 0, trend should be 100%
      expect(data.trend_percent).toBe(100);
    });

    it('should return 500 when Supabase key is missing', async () => {
      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players' },
        locals: { runtime: { env: {} } },
      } as any);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toContain('Server configuration error');
    });

    it('should handle Supabase API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve('Service Unavailable'),
      });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should handle null players_online values gracefully', async () => {
      const mockPings = [
        { created_at: '2026-04-13T10:00:00Z', players_online: null },
        { created_at: '2026-04-13T10:30:00Z', players_online: 40 },
        { created_at: '2026-04-13T11:00:00Z', players_online: 45 },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players?hours=2' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      // Should only count non-null values: (40+45)/2 = 42.5, rounded to 43
      expect(data.avg_players).toBe(43);
      expect(data.total_samples).toBe(3);
    });

    it('should return zeros for empty ping data', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'empty-server' },
        request: { url: 'http://localhost/api/servers/empty-server/players?hours=1' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.avg_players).toBe(0);
      expect(data.max_players).toBe(0);
      expect(data.min_players).toBe(0);
      expect(data.total_samples).toBe(0);
      expect(data.trend_percent).toBe(0);
      expect(data.chart_data).toHaveLength(1); // Still has chart slots for the hour
    });

    it('should aggregate multiple pings per hour correctly', async () => {
      const now = new Date('2026-04-13T12:00:00Z');
      vi.setSystemTime(now);

      const mockPings = [
        { created_at: '2026-04-13T11:05:00Z', players_online: 30 },
        { created_at: '2026-04-13T11:15:00Z', players_online: 35 },
        { created_at: '2026-04-13T11:25:00Z', players_online: 40 },
        { created_at: '2026-04-13T11:45:00Z', players_online: 45 },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players?hours=2' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      const data = await response.json();
      // All pings are in hour 11, so chart should have entries for hours 10 and 11
      const hour11Data = data.chart_data.find((d: any) => d.hour.includes('T11:'));
      expect(hour11Data).toBeDefined();
      expect(hour11Data.avg_players).toBe(38); // (30+35+40+45)/4 = 37.5, rounded
      expect(hour11Data.max_players).toBe(45);
      expect(hour11Data.min_players).toBe(30);
      expect(hour11Data.sample_count).toBe(4);
    });

    it('should include CORS headers on success', async () => {
      const mockPings = [{ created_at: '2026-04-13T10:00:00Z', players_online: 25 }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPings),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.GET({
        params: { id: 'test-server' },
        request: { url: 'http://localhost/api/servers/test-server/players' },
        locals: { runtime: { env: { SUPABASE_SERVICE_KEY: 'test-key' } } },
      } as any);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('OPTIONS /api/servers/[id]/players', () => {
    it('should return CORS headers for preflight', async () => {
      const module = await import('../src/pages/api/servers/[id]/players.ts');
      const response = await module.OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
    });
  });
});
