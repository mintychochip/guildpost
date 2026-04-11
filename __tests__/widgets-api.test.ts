import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';

// Mock the supabase client
vi.mock('../src/lib/supabase', () => ({
  createClient: vi.fn()
}));

import { createClient } from '../src/lib/supabase';

describe('Widgets API', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    };
    (createClient as any).mockReturnValue(mockSupabase);
  });

  const createMockContext = (params: any, searchParams: Record<string, string> = {}): any => ({
    params,
    request: {
      url: `http://localhost:4321/api/widgets/${params.id}?${new URLSearchParams(searchParams)}`
    }
  });

  it('returns 400 when server ID is missing', async () => {
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: undefined });
    
    const response = await GET(context);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Server ID required');
  });

  it('returns 404 when server is not found', async () => {
    mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Not found') });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'non-existent-id' });
    
    const response = await GET(context);
    expect(response.status).toBe(404);
    
    const data = await response.json();
    expect(data.error).toBe('Server not found');
  });

  it('returns JSON data for valid server', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      description: 'A test server',
      tags: ['pvp', 'survival'],
      version: '1.20.4',
      vote_count: 42,
      server_status: [{
        online: true,
        players_online: 150,
        players_max: 500,
        latency_ms: 45,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'json' });
    
    const response = await GET(context);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    
    const data = await response.json();
    expect(data.id).toBe('test-id');
    expect(data.name).toBe('Test Server');
    expect(data.status).toBe('online');
    expect(data.players.online).toBe(150);
    expect(data.players.max).toBe(500);
    expect(data.votes).toBe(42);
  });

  it('returns offline status when server is down', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Offline Server',
      ip: 'offline.test.com',
      port: 25565,
      vote_count: 10,
      server_status: [{
        online: false,
        players_online: 0,
        players_max: 100,
        latency_ms: 0,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'json' });
    
    const response = await GET(context);
    const data = await response.json();
    
    expect(data.status).toBe('offline');
    expect(data.players.online).toBe(0);
  });

  it('returns HTML widget when format is html', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 25,
      server_status: [{
        online: true,
        players_online: 50,
        players_max: 100,
        latency_ms: 30,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'html', size: 'medium', theme: 'dark' });
    
    const response = await GET(context);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/html');
    
    const html = await response.text();
    expect(html).toContain('Test Server');
    expect(html).toContain('50');
    expect(html).toContain('25');
    expect(html).toContain('GuildPost');
    expect(html).toContain('Auto-refresh');
  });

  it('returns SVG banner when format is png', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 100,
      server_status: [{
        online: true,
        players_online: 200,
        players_max: 500,
        latency_ms: 25,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'png', theme: 'dark' });
    
    const response = await GET(context);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
    
    const svg = await response.text();
    expect(svg).toContain('<?xml version="1.0"');
    expect(svg).toContain('Test Server');
    expect(svg).toContain('200');
    expect(svg).toContain('500');
    expect(svg).toContain('GuildPost');
  });

  it('supports light theme', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 15,
      server_status: [{
        online: true,
        players_online: 30,
        players_max: 50,
        latency_ms: 20,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'html', theme: 'light' });
    
    const response = await GET(context);
    const html = await response.text();
    
    expect(html).toContain('#ffffff');
    expect(html).toContain('#1a1a2e');
  });

  it('supports different sizes', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 50,
      server_status: [{
        online: true,
        players_online: 75,
        players_max: 200,
        latency_ms: 35,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    
    // Test small size
    const smallContext = createMockContext({ id: 'test-id' }, { format: 'png', size: 'small' });
    const smallResponse = await GET(smallContext);
    const smallSvg = await smallResponse.text();
    expect(smallSvg).toContain('width="240"');
    expect(smallSvg).toContain('height="120"');
    
    // Test large size
    const largeContext = createMockContext({ id: 'test-id' }, { format: 'png', size: 'large' });
    const largeResponse = await GET(largeContext);
    const largeSvg = await largeResponse.text();
    expect(largeSvg).toContain('width="380"');
    expect(largeSvg).toContain('height="160"');
  });

  it('hides branding when branding=false', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 20,
      server_status: [{
        online: true,
        players_online: 40,
        players_max: 100,
        latency_ms: 30,
        updated_at: '2026-04-11T08:00:00Z'
      }]
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'html', branding: 'false' });
    
    const response = await GET(context);
    const html = await response.text();
    
    expect(html).toContain('display: none');
  });

  it('returns 400 for invalid format', async () => {
    const mockServer = {
      id: 'test-id',
      name: 'Test Server',
      ip: 'play.test.com',
      port: 25565,
      vote_count: 10,
      server_status: []
    };
    
    mockSupabase.single.mockResolvedValue({ data: mockServer, error: null });
    
    const { GET } = await import('../src/pages/api/widgets/[id]');
    const context = createMockContext({ id: 'test-id' }, { format: 'invalid' });
    
    const response = await GET(context);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid format');
  });
});
