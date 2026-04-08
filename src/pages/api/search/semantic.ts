/**
 * Semantic Search API Endpoint for Astro SSR
 * POST /api/search/semantic - AI-powered semantic search using Gemini embeddings
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Generate embedding using Gemini embedding model
async function generateEmbedding(text: string, apiKey: string) {
  // Try multiple Gemini embedding models (in order of preference)
  const models = [
    'text-embedding-004',  // 768 dims
    'gemini-embedding-001', // 768 dims
    'embedding-001',        // 768 dims
  ];
  
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: { parts: [{ text }] }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const embedding = data.embedding?.values || data.embedding;
        // Return first 768 dimensions if larger
        return embedding.slice(0, 768);
      }
    } catch (err) {
      console.log(`Model ${model} failed, trying next...`);
    }
  }
  
  throw new Error('No Gemini embedding model available');
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Get environment from Cloudflare runtime
  // Try multiple ways to access env vars in Cloudflare
  const env = (locals as any)?.runtime?.env || 
              (locals as any)?.env || 
              (globalThis as any)?.env || 
              {};
  
  try {
    const { query, limit = 10 } = await request.json();

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ error: 'Query too short' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    
    // Debug: log available env vars (not values)
    console.log('Available env keys:', Object.keys(env));
    console.log('GEMINI_API_KEY present:', !!apiKey);
    console.log('locals keys:', Object.keys(locals || {}));
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'GEMINI_API_KEY not configured',
        debug: {
          hasRuntime: !!locals?.runtime,
          envKeys: Object.keys(env)
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate embedding for query
    const embedding = await generateEmbedding(query, apiKey);

    // Search Supabase for similar embeddings
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_SERVICE_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/match_servers`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: limit
      })
    });

    const results = await response.json();

    return new Response(JSON.stringify({
      query,
      results,
      count: results.length,
      semantic: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('Semantic search error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
