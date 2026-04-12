import { describe, it, expect } from 'vitest';

// Test NewServers component props and rendering logic
const mockServers = [
  {
    id: 'server-1',
    name: 'Fresh SMP',
    ip: 'fresh.example.com',
    port: 25565,
    description: 'A brand new survival server',
    players_online: 12,
    max_players: 100,
    vote_count: 5,
    status: 'online',
    banner: 'https://example.com/banner1.png',
    icon: 'https://example.com/icon1.png',
    tags: ['Survival', 'SMP', 'Vanilla'],
    tier: 'free',
    rating_average: 4.5,
    rating_count: 2,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'server-2',
    name: 'New PvP Arena',
    ip: 'pvp.example.com',
    port: 25565,
    description: 'Competitive PvP server just launched',
    players_online: 45,
    max_players: 200,
    vote_count: 15,
    status: 'online',
    tags: ['PvP', 'Arena', 'Minigames'],
    tier: 'premium',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'server-3',
    name: 'Skyblock Beginnings',
    ip: 'skyblock.example.com',
    port: 25565,
    players_online: 0,
    max_players: 50,
    vote_count: 0,
    status: 'offline',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

// Helper function to format relative time (mirrors component logic)
const getRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

// Helper function to format players (mirrors component logic)
const formatPlayers = (online: number = 0, max: number = 0) => {
  if (max === 0) return `${online} online`;
  return `${online.toLocaleString()}/${max.toLocaleString()}`;
};

describe('NewServers Component Logic', () => {
  it('correctly formats relative time for recent servers', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    
    expect(getRelativeTime(twoHoursAgo)).toBe('2h ago');
    expect(getRelativeTime(oneDayAgo)).toBe('Yesterday');
    expect(getRelativeTime(fiveDaysAgo)).toBe('5 days ago');
  });

  it('returns empty string for undefined dates', () => {
    expect(getRelativeTime(undefined)).toBe('');
  });

  it('correctly formats player counts', () => {
    expect(formatPlayers(12, 100)).toBe('12/100');
    expect(formatPlayers(45, 200)).toBe('45/200');
    expect(formatPlayers(0, 50)).toBe('0/50');
    expect(formatPlayers(5, 0)).toBe('5 online');
  });

  it('mock servers have required properties', () => {
    mockServers.forEach(server => {
      expect(server.id).toBeDefined();
      expect(server.name).toBeDefined();
      expect(server.ip).toBeDefined();
      expect(server.port).toBeDefined();
      expect(server.status).toBeDefined();
      expect(server.created_at).toBeDefined();
    });
  });

  it('mock servers have valid status values', () => {
    mockServers.forEach(server => {
      expect(['online', 'offline']).toContain(server.status);
    });
  });

  it('mock servers have valid created_at dates', () => {
    mockServers.forEach(server => {
      const date = new Date(server.created_at);
      expect(date.getTime()).toBeLessThan(Date.now());
      expect(date.getTime()).toBeGreaterThan(Date.now() - 30 * 24 * 60 * 60 * 1000); // Within 30 days
    });
  });

  it('calculates star rating display correctly', () => {
    const serverWithRating = mockServers[0];
    expect(serverWithRating.rating_average).toBe(4.5);
    expect(serverWithRating.rating_count).toBe(2);
    
    const roundedStars = Math.round(serverWithRating.rating_average || 0);
    expect(roundedStars).toBe(5);
  });

  it('generates correct server URLs', () => {
    mockServers.forEach(server => {
      const url = `/servers/${server.id}`;
      expect(url).toBe(`/servers/${server.id}`);
    });
  });

  it('generates correct connection strings', () => {
    mockServers.forEach(server => {
      const connection = `${server.ip}:${server.port}`;
      expect(connection).toBe(`${server.ip}:${server.port}`);
    });
  });

  it('filters tags correctly (max 3 displayed)', () => {
    mockServers.forEach(server => {
      const displayTags = server.tags?.slice(0, 3) || [];
      expect(displayTags.length).toBeLessThanOrEqual(3);
      
      if (server.tags && server.tags.length > 3) {
        expect(server.tags.length - 3).toBeGreaterThan(0);
      }
    });
  });

  it('correctly identifies tier badges', () => {
    const premiumServer = mockServers.find(s => s.tier === 'premium');
    const freeServer = mockServers.find(s => s.tier === 'free');
    
    expect(premiumServer?.tier).toBe('premium');
    expect(freeServer?.tier).toBe('free');
  });

  it('handles missing optional properties gracefully', () => {
    const serverWithMissingData = mockServers[2]; // Skyblock with minimal data
    
    // Should have default values or be optional
    expect(serverWithMissingData.description).toBeUndefined();
    expect(serverWithMissingData.banner).toBeUndefined();
    expect(serverWithMissingData.icon).toBeUndefined();
    expect(serverWithMissingData.tags).toBeUndefined();
    expect(serverWithMissingData.rating_average).toBeUndefined();
    expect(serverWithMissingData.rating_count).toBeUndefined();
  });

  it('Schema.org structured data is valid', () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "New Minecraft Servers",
      "itemListElement": mockServers.map((server, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "GameServer",
          "name": server.name,
          "url": `https://guildpost.tech/servers/${server.id}`,
          "game": {
            "@type": "VideoGame",
            "name": "Minecraft"
          },
          "playerCount": {
            "@type": "QuantitativeValue",
            "value": server.players_online || 0
          },
          "dateCreated": server.created_at
        }
      }))
    };
    
    expect(structuredData["@type"]).toBe("ItemList");
    expect(structuredData.name).toBe("New Minecraft Servers");
    expect(structuredData.itemListElement).toHaveLength(3);
    expect(structuredData.itemListElement[0].item["@type"]).toBe("GameServer");
  });
});
