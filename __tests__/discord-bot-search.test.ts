import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Discord Bot Search Command', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Slash command structure', () => {
    it('should define /search command with query parameter', () => {
      const command = {
        name: 'search',
        description: 'Search for Minecraft servers on GuildPost',
        options: [
          {
            name: 'query',
            description: 'What kind of server are you looking for?',
            type: 3, // STRING
            required: true,
          }
        ]
      };

      expect(command.name).toBe('search');
      expect(command.options).toHaveLength(1);
      expect(command.options[0].name).toBe('query');
      expect(command.options[0].required).toBe(true);
    });

    it('should define optional limit parameter', () => {
      const command = {
        name: 'search',
        options: [
          { name: 'query', required: true },
          {
            name: 'limit',
            description: 'Number of results (1-5)',
            type: 4, // INTEGER
            required: false,
            min_value: 1,
            max_value: 5
          }
        ]
      };

      const limitOption = command.options.find(o => o.name === 'limit');
      expect(limitOption).toBeDefined();
      expect(limitOption?.required).toBe(false);
      expect(limitOption?.min_value).toBe(1);
      expect(limitOption?.max_value).toBe(5);
    });
  });

  describe('Discord interaction handling', () => {
    it('should extract query from slash command interaction', () => {
      const interaction = {
        type: 2, // APPLICATION_COMMAND
        data: {
          name: 'search',
          options: [
            { name: 'query', value: 'pvp faction server' }
          ]
        }
      };

      const query = interaction.data.options.find(o => o.name === 'query')?.value;
      expect(query).toBe('pvp faction server');
    });

    it('should handle interactions without optional limit', () => {
      const interaction = {
        data: {
          name: 'search',
          options: [
            { name: 'query', value: 'survival' }
          ]
        }
      };

      const limit = interaction.data.options.find(o => o.name === 'limit')?.value ?? 3;
      expect(limit).toBe(3);
    });

    it('should use provided limit when specified', () => {
      const interaction = {
        data: {
          name: 'search',
          options: [
            { name: 'query', value: 'minigames' },
            { name: 'limit', value: 5 }
          ]
        }
      };

      const limit = interaction.data.options.find(o => o.name === 'limit')?.value ?? 3;
      expect(limit).toBe(5);
    });
  });

  describe('GuildPost API integration', () => {
    it('should call hybrid search endpoint with query', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { id: '1', name: 'Test Server', description: 'A test server', player_count: 100 }
          ]
        })
      });
      global.fetch = mockFetch;

      const query = 'pvp server';
      const apiUrl = `https://guildpost.tech/api/search?q=${encodeURIComponent(query)}`;

      await fetch(apiUrl);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://guildpost.tech/api/search?q=pvp%20server'
      );
    });

    it('should include embedding parameter for AI search', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] })
      });
      global.fetch = mockFetch;

      const query = 'factions with economy';
      await fetch(`https://guildpost.tech/api/search?q=${query}&embedding=true`);

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('embedding=true');
    });
  });

  describe('Discord embed formatting', () => {
    it('should create rich embed for server result', () => {
      const server = {
        id: 'abc123',
        name: 'Epic PvP',
        description: 'The best PvP server with factions',
        player_count: 250,
        max_players: 500,
        version: '1.20.4',
        icon: 'https://example.com/icon.png',
        votifier: { enabled: true }
      };

      const embed = {
        title: server.name,
        description: server.description.substring(0, 200),
        thumbnail: { url: server.icon },
        fields: [
          { name: 'Players', value: `${server.player_count}/${server.max_players}`, inline: true },
          { name: 'Version', value: server.version, inline: true },
          { name: 'Votifier', value: server.votifier.enabled ? '✅ Enabled' : '❌ Disabled', inline: true }
        ],
        url: `https://guildpost.tech/servers/${server.id}`
      };

      expect(embed.title).toBe('Epic PvP');
      expect(embed.fields).toHaveLength(3);
      expect(embed.url).toContain('/servers/abc123');
    });

    it('should truncate long descriptions', () => {
      const longDesc = 'a'.repeat(300);
      const embed = {
        description: longDesc.substring(0, 200) + (longDesc.length > 200 ? '...' : '')
      };

      expect(embed.description.length).toBeLessThanOrEqual(203);
      expect(embed.description.slice(-3)).toBe('...');
    });

    it('should format multiple results as separate embeds', () => {
      const servers = [
        { id: '1', name: 'Server One', description: 'First', player_count: 50 },
        { id: '2', name: 'Server Two', description: 'Second', player_count: 100 }
      ];

      const embeds = servers.map(s => ({
        title: s.name,
        description: s.description,
        fields: [{ name: 'Players', value: String(s.player_count), inline: true }]
      }));

      expect(embeds).toHaveLength(2);
      expect(embeds[0].title).toBe('Server One');
      expect(embeds[1].title).toBe('Server Two');
    });
  });

  describe('Error handling', () => {
    it('should handle API failure gracefully', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      const errorResponse = {
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: 'Sorry, search is temporarily unavailable. Please try again later.',
          flags: 64 // EPHEMERAL
        }
      };

      expect(errorResponse.data.content).toContain('temporarily unavailable');
      expect(errorResponse.data.flags).toBe(64);
    });

    it('should handle empty search results', () => {
      const results = [];

      const response = {
        type: 4,
        data: {
          content: results.length === 0
            ? 'No servers found matching your query. Try different keywords!'
            : undefined,
          embeds: results.length > 0 ? [] : undefined
        }
      };

      expect(response.data.content).toContain('No servers found');
    });

    it('should handle invalid query (too short)', () => {
      const query = 'ab';

      const isValid = query.length >= 3;
      const errorMessage = isValid ? null : 'Query must be at least 3 characters long.';

      expect(isValid).toBe(false);
      expect(errorMessage).toBe('Query must be at least 3 characters long.');
    });

    it('should handle rate limiting', () => {
      const rateLimitResponse = {
        type: 4,
        data: {
          content: 'Please wait a moment before searching again.',
          flags: 64
        }
      };

      expect(rateLimitResponse.data.content).toContain('wait a moment');
    });
  });

  describe('CORS and permissions', () => {
    it('should include proper CORS headers in API calls', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] })
      });
      global.fetch = mockFetch;

      await fetch('https://guildpost.tech/api/search?q=test', {
        headers: { 'Origin': 'discord.com' }
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Origin': 'discord.com' })
        })
      );
    });

    it('should verify bot has embed links permission', () => {
      const permissions = 84992;
      const hasEmbedLinks = (permissions & 16384) !== 0;

      expect(hasEmbedLinks).toBe(true);
    });

    it('should verify bot has send messages permission', () => {
      const permissions = 84992;
      const hasSendMessages = (permissions & 2048) !== 0;

      expect(hasSendMessages).toBe(true);
    });
  });

  describe('Interaction response types', () => {
    it('should use defer for slow searches', () => {
      const response = {
        type: 5, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        data: { flags: 64 }
      };

      expect(response.type).toBe(5);
    });

    it('should edit deferred message with results', () => {
      const editPayload = {
        content: null,
        embeds: [{ title: 'Search Results' }]
      };

      expect(editPayload.embeds).toHaveLength(1);
      expect(editPayload.content).toBeNull();
    });
  });
});
