import { describe, it, expect, vi, beforeEach } from 'vitest';

// Helper to create mock request
const mockRequest = (body: any) => ({
  method: 'POST',
  json: () => Promise.resolve(body)
}) as any;

// Default locals with API keys
const mockLocals = {
  runtime: {
    env: {
      GEMINI_API_KEY: 'test-gemini-key',
      JINA_API_KEY: 'test-jina-key',
      PINECONE_API_KEY: 'test-pinecone-key',
      PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      PINECONE_INDEX: 'guildpost'
    }
  }
};

describe('Wizard Chat API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/wizard/chat', () => {
    it('should return helpful prompt when message is too short', async () => {
      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'a', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.response).toContain('Tell me what kind of Minecraft server');
    });

    it('should return fallback response when no Gemini API key', async () => {
      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'I want a survival server', history: [] });
      const localsNoKey = { runtime: { env: {} } };
      
      const response = await POST({ request, locals: localsNoKey } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.ai).toBe(false);
      expect(data.response).toContain('more specific');
    });

    it('should perform direct search when performSearch is true', async () => {
      // Setup URL-based mock responses
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        
        if (urlStr.includes('api.pinecone.io/indexes')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ host: 'test-pinecone.io' })
          } as Response);
        }
        if (urlStr.includes('api.jina.ai')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              data: [{ embedding: [0.1, 0.2, 0.3] }]
            })
          } as Response);
        }
        if (urlStr.includes('test-pinecone.io/query')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              matches: [
                { id: 'server-1', score: 0.95, metadata: { name: 'Test Server', tags: ['survival'] } },
                { id: 'server-2', score: 0.85, metadata: { name: 'Another Server', tags: ['pvp'] } }
              ]
            })
          } as Response);
        }
        if (urlStr.includes('supabase.co')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: 'server-1', name: 'Test Server', gamemode: 'survival' },
              { id: 'server-2', name: 'Another Server', gamemode: 'pvp' }
            ])
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival server', history: [], performSearch: true });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(true);
      expect(data.ai).toBe(false);
      expect(data.searchType).toBe('hybrid');
      expect(data.results).toHaveLength(2);
    });

    it('should handle search error gracefully when performSearch fails', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Pinecone connection failed'));

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival', history: [], performSearch: true });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.response).toContain('trouble searching');
    });

    it('should call Gemma AI and parse SEARCH_READY response', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          // Gemma AI response
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              candidates: [{
                content: {
                  parts: [{ text: 'Great choice! I found some excellent survival servers. SEARCH_READY: survival smp claims' }]
                }
              }]
            })
          } as Response);
        }
        if (urlStr.includes('api.pinecone.io/indexes')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ host: 'test-pinecone.io' })
          } as Response);
        }
        if (urlStr.includes('api.jina.ai')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [{ embedding: [0.1, 0.2, 0.3] }] })
          } as Response);
        }
        if (urlStr.includes('pinecone.io/query')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              matches: [
                { id: 'server-1', score: 0.92, metadata: { name: 'SMP Survival', description: 'survival smp with claims', tags: ['survival', 'smp', 'claims'] } }
              ]
            })
          } as Response);
        }
        if (urlStr.includes('supabase.co')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 'server-1', name: 'SMP Survival', gamemode: 'survival' }])
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'looking for a survival smp with claims', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(true);
      expect(data.ai).toBe(true);
      expect(data.searchQuery).toBe('survival smp claims');
      expect(data.response).not.toContain('SEARCH_READY');
      expect(data.results).toHaveLength(1);
    });

    it('should handle AI response without SEARCH_READY', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              candidates: [{
                content: {
                  parts: [{ text: 'Tell me more about what features you want in your survival server!' }]
                }
              }]
            })
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.ai).toBe(true);
      expect(data.response).toContain('features you want');
    });

    it('should handle empty AI response gracefully', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ candidates: [] })
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'pvp server', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.response).toContain('Tell me more');
    });

    it('should handle Gemma API errors gracefully', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return Promise.reject(new Error('Gemma API error: 503'));
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'minigames server', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.ai).toBe(false);
      expect(data.response).toContain('AI brain');
    });
  });

  describe('CORS handling', () => {
    it('should handle OPTIONS preflight request', async () => {
      const { OPTIONS } = await import('../src/pages/api/wizard/chat');
      
      const response = await OPTIONS();
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should include CORS headers in POST response', async () => {
      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'a', history: [] });
      
      const response = await POST({ request, locals: mockLocals } as any);
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('Hybrid search ranking', () => {
    it('should boost keyword matches in hybrid scoring', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        
        if (urlStr.includes('api.pinecone.io/indexes')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ host: 'test-pinecone.io' })
          } as Response);
        }
        if (urlStr.includes('api.jina.ai')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [{ embedding: [0.1, 0.2, 0.3] }] })
          } as Response);
        }
        if (urlStr.includes('pinecone.io/query')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              matches: [
                { id: 'server-1', score: 0.80, metadata: { name: 'Survival Paradise', description: 'best survival', tags: ['survival', 'smp'] } },
                { id: 'server-2', score: 0.85, metadata: { name: 'PvP Arena', description: 'competitive pvp', tags: ['pvp', 'arena'] } }
              ]
            })
          } as Response);
        }
        if (urlStr.includes('supabase.co')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: 'server-1', name: 'Survival Paradise', gamemode: 'survival' },
              { id: 'server-2', name: 'PvP Arena', gamemode: 'pvp' }
            ])
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival paradise', history: [], performSearch: true });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      // Survival Paradise should rank higher despite lower semantic score due to keyword matches
      expect(data.results[0].name).toBe('Survival Paradise');
      expect(data.results[0].keywordScore).toBeGreaterThan(0);
    });
  });

  describe('Error scenarios', () => {
    it('should handle missing Pinecone API key', async () => {
      const localsNoPinecone = {
        runtime: {
          env: {
            GEMINI_API_KEY: 'test-gemini-key',
            JINA_API_KEY: 'test-jina-key'
            // Missing PINECONE_API_KEY
          }
        }
      };

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival', history: [], performSearch: true });
      
      const response = await POST({ request, locals: localsNoPinecone } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
      expect(data.response).toContain('trouble');
    });

    it('should handle Pinecone index lookup failure', async () => {
      vi.spyOn(global, 'fetch').mockImplementation((url: string | Request | URL) => {
        const urlStr = url.toString();
        if (urlStr.includes('api.pinecone.io/indexes')) {
          return Promise.resolve({
            ok: false,
            text: () => Promise.resolve('Index not found')
          } as Response);
        }
        return Promise.resolve({ ok: false } as Response);
      });

      const { POST } = await import('../src/pages/api/wizard/chat');
      const request = mockRequest({ message: 'survival', history: [], performSearch: true });
      
      const response = await POST({ request, locals: mockLocals } as any);
      const data = await response.json();
      
      expect(data.readyToSearch).toBe(false);
    });
  });
});
