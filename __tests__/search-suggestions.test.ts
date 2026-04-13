import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, OPTIONS } from '../src/pages/api/search/suggestions';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Search Suggestions API', () => {
  const createMockContext = (env = {}) => ({
    request: new Request('http://localhost:3000/api/search/suggestions?q=minecraft'),
    locals: { runtime: { env } }
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('GET /api/search/suggestions', () => {
    it('returns empty suggestions for short queries (< 2 chars)', async () => {
      const context = {
        request: new Request('http://localhost:3000/api/search/suggestions?q=a'),
        locals: { runtime: { env: {} } }
      };

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([]);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('returns fallback suggestions when no API key', async () => {
      const context = createMockContext({});

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('minecraft');
      expect(data.suggestions).toEqual([
        'minecraft pvp server',
        'minecraft survival smp',
        'minecraft skyblock',
        'minecraft factions',
        'minecraft minigames'
      ]);
    });

    it('uses Gemma AI when API key is available', async () => {
      const mockSuggestions = ['minecraft survival', 'minecraft pvp', 'minecraft smp', 'minecraft factions', 'minecraft skyblock'];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify(mockSuggestions) }]
            }
          }]
        })
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('minecraft');
      expect(data.suggestions).toEqual(mockSuggestions);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toContain('generativelanguage.googleapis.com');
      expect(fetchCall[0]).toContain('test-key');
    });

    it('handles empty query parameter', async () => {
      const context = {
        request: new URL('http://localhost:3000/api/search/suggestions?q='),
        locals: { runtime: { env: {} } }
      };
      // Need to construct proper URL
      const request = new Request('http://localhost:3000/api/search/suggestions?q=');

      const response = await GET({ request, locals: context.locals } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([]);
    });

    it('falls back to generated suggestions on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('minecraft');
      expect(data.suggestions).toEqual([
        'minecraft pvp server',
        'minecraft survival smp',
        'minecraft skyblock',
        'minecraft factions',
        'minecraft minigames'
      ]);
    });

    it('falls back when AI response has no JSON array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: 'not valid json - no brackets here' }]
            }
          }]
        })
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([
        'minecraft pvp server',
        'minecraft survival smp',
        'minecraft skyblock',
        'minecraft factions',
        'minecraft minigames'
      ]);
    });

    it('limits suggestions to 5 items max', async () => {
      const manySuggestions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify(manySuggestions) }]
            }
          }]
        })
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toHaveLength(5);
    });

    it('extracts JSON array from text with surrounding content', async () => {
      const mockSuggestions = ['survival', 'creative', 'hardcore'];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: `Here are some suggestions: ${JSON.stringify(mockSuggestions)} Hope that helps!` }]
            }
          }]
        })
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual(mockSuggestions);
    });

    it('falls back when AI returns no candidates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] })
      });

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toEqual([
        'minecraft pvp server',
        'minecraft survival smp',
        'minecraft skyblock',
        'minecraft factions',
        'minecraft minigames'
      ]);
    });

    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const context = createMockContext({ GEMINI_API_KEY: 'test-key' });

      const response = await GET(context as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.query).toBe('minecraft');
      expect(data.suggestions.length).toBe(5);
    });

    it('uses process.env when locals.runtime.env unavailable', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = 'fallback-key';

      const context = {
        request: new Request('http://localhost:3000/api/search/suggestions?q=test'),
        locals: {}  // Missing runtime.env entirely
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{ text: JSON.stringify(['test result']) }]
            }
          }]
        })
      });

      const response = await GET(context as any);

      expect(mockFetch).toHaveBeenCalled();
      const fetchUrl = mockFetch.mock.calls[0][0];
      expect(fetchUrl).toContain('fallback-key');

      process.env.GEMINI_API_KEY = originalKey;
    });

    it('includes CORS headers in response', async () => {
      const context = createMockContext({});

      const response = await GET(context as any);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });

  describe('OPTIONS /api/search/suggestions', () => {
    it('returns CORS headers for preflight', async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });
  });
});
