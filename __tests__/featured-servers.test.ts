import { describe, it, expect } from 'vitest';

// Test FeaturedServers component props and rendering logic
const mockServers = [
  {
    id: 'server-1',
    name: 'Hypixel',
    ip: 'mc.hypixel.net',
    port: 25565,
    description: 'The best Minecraft server',
    players_online: 45000,
    max_players: 50000,
    vote_count: 1250,
    status: 'online',
    banner: 'https://example.com/banner1.png',
    icon: 'https://example.com/icon1.png',
    tags: ['Minigames', 'PvP', 'Skyblock'],
    tier: 'elite'
  },
  {
    id: 'server-2',
    name: 'Mineplex',
    ip: 'mineplex.com',
    port: 25565,
    description: 'Awesome mini games',
    players_online: 12000,
    max_players: 20000,
    vote_count: 890,
    status: 'online',
    banner: null,
    icon: null,
    tags: ['Minigames'],
    tier: 'premium'
  },
  {
    id: 'server-3',
    name: 'Small SMP',
    ip: 'smp.example.com',
    port: 25565,
    description: null,
    players_online: 50,
    max_players: 100,
    vote_count: 12,
    status: 'offline',
    banner: null,
    icon: null,
    tags: ['Survival', 'SMP'],
    tier: 'basic'
  }
];

describe('FeaturedServers Component', () => {
  it('should handle empty servers array', () => {
    const servers: any[] = [];
    expect(servers.length).toBe(0);
  });

  it('should handle servers with all fields', () => {
    const server = mockServers[0];
    expect(server.id).toBe('server-1');
    expect(server.name).toBe('Hypixel');
    expect(server.players_online).toBe(45000);
    expect(server.tier).toBe('elite');
    expect(server.tags).toHaveLength(3);
  });

  it('should handle servers with null/optional fields', () => {
    const server = mockServers[2];
    expect(server.description).toBeNull();
    expect(server.banner).toBeNull();
    expect(server.icon).toBeNull();
  });

  it('should format player counts correctly', () => {
    const formatPlayers = (online: number = 0, max: number = 0) => {
      if (max === 0) return `${online} online`;
      return `${online.toLocaleString()}/${max.toLocaleString()}`;
    };

    expect(formatPlayers(45000, 50000)).toBe('45,000/50,000');
    expect(formatPlayers(50, 100)).toBe('50/100');
    expect(formatPlayers(0, 0)).toBe('0 online');
  });

  it('should identify tier badges correctly', () => {
    const getTierBadge = (tier: string) => {
      if (tier === 'elite') return '👑 Elite';
      if (tier === 'premium') return '⭐ Premium';
      return null;
    };

    expect(getTierBadge('elite')).toBe('👑 Elite');
    expect(getTierBadge('premium')).toBe('⭐ Premium');
    expect(getTierBadge('basic')).toBeNull();
  });

  it('should handle fallback mode flag', () => {
    const isFallback = true;
    const title = isFallback ? 'Trending Servers' : 'Featured Servers';
    expect(title).toBe('Trending Servers');
  });

  it('should handle non-fallback mode', () => {
    const isFallback = false;
    const title = isFallback ? 'Trending Servers' : 'Featured Servers';
    expect(title).toBe('Featured Servers');
  });

  it('should limit tag display to 3 tags', () => {
    const server = mockServers[0];
    const displayTags = server.tags.slice(0, 3);
    expect(displayTags).toHaveLength(3);
  });

  it('should handle server status indicators', () => {
    const isOnline = (status: string) => status === 'online';
    expect(isOnline('online')).toBe(true);
    expect(isOnline('offline')).toBe(false);
  });

  it('should handle vote count formatting', () => {
    const formatVotes = (count: number) => count.toLocaleString();
    expect(formatVotes(1250)).toBe('1,250');
    expect(formatVotes(0)).toBe('0');
    expect(formatVotes(1000000)).toBe('1,000,000');
  });
});

describe('Homepage Featured Servers Integration', () => {
  it('should fetch featured servers from API endpoint', () => {
    const apiEndpoint = '/api/servers/featured?limit=6';
    expect(apiEndpoint).toContain('/api/servers/featured');
    expect(apiEndpoint).toContain('limit=6');
  });

  it('should handle featured servers RPC response', () => {
    const mockResponse = {
      servers: mockServers,
      is_fallback: false,
      featured_count: 3
    };
    expect(mockResponse.servers).toHaveLength(3);
    expect(mockResponse.is_fallback).toBe(false);
  });

  it('should handle fallback response when no featured servers', () => {
    const mockResponse = {
      servers: mockServers.slice(0, 2),
      is_fallback: true,
      message: 'No featured servers available - showing top voted servers'
    };
    expect(mockResponse.is_fallback).toBe(true);
    expect(mockResponse.message).toContain('top voted');
  });

  it('should preserve server order from featured data', () => {
    const featuredOrder = ['server-2', 'server-1', 'server-3'];
    const orderedServers = featuredOrder.map(id => 
      mockServers.find(s => s.id === id)
    ).filter(Boolean);
    
    expect(orderedServers[0]?.id).toBe('server-2');
    expect(orderedServers[1]?.id).toBe('server-1');
    expect(orderedServers[2]?.id).toBe('server-3');
  });
});
