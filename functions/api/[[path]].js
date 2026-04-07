/**
 * Cloudflare Worker: Semantic Search API + Click Tracking
 * 
 * Routes:
 * - POST /search/semantic - AI-powered semantic search
 * - POST /track/click - Track user clicks
 * - GET /analytics/popular - Get popular servers
 * - POST /embed - Generate embeddings
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Semantic Search
      if (path === '/search/semantic' && request.method === 'POST') {
        return await handleSemanticSearch(request, env);
      }

      // Click Tracking
      if (path === '/track/click' && request.method === 'POST') {
        return await handleClickTrack(request, env);
      }

      // Get Popular/Trending
      if (path === '/analytics/popular' && request.method === 'GET') {
        return await handlePopularServers(request, env);
      }

      // Search Suggestions
      if (path === '/search/suggestions' && request.method === 'GET') {
        return await handleSuggestions(request, env);
      }
      
      // Generate Embedding
      if (path === '/embed' && request.method === 'POST') {
        return await handleEmbed(request, env);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Semantic Search using Cloudflare Workers AI
async function handleSemanticSearch(request, env) {
  const { query, limit = 10 } = await request.json();

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ error: 'Query too short' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Generate embedding for query using Workers AI
  const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [query]
  });

  // Search Supabase for similar embeddings using pgvector
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
      query_embedding: embedding.data[0],
      match_threshold: 0.7,
      match_count: limit
    })
  });

  const results = await response.json();

  // Log search query for analytics
  await logSearch(env, query, results.length);

  return new Response(JSON.stringify({
    query,
    results,
    count: results.length,
    semantic: true
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Track clicks for analytics
async function handleClickTrack(request, env) {
  const { server_id, type = 'view', source = 'listing' } = await request.json();

  if (!server_id) {
    return new Response(JSON.stringify({ error: 'Missing server_id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get client info
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const country = request.cf?.country || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';

  // Create click event
  const clickEvent = {
    server_id,
    type,
    source,
    ip_hash: await hashIP(ip), // Hash for privacy
    country,
    user_agent_hash: await hashString(userAgent),
    timestamp: new Date().toISOString(),
    hour_bucket: new Date().toISOString().slice(0, 13) // For hourly aggregation
  };

  // Store in KV for real-time tracking
  const key = `clicks:${new Date().toISOString().slice(0, 10)}:${server_id}`;
  const existing = await env.CLICK_ANALYTICS.get(key);
  const clicks = existing ? JSON.parse(existing) : [];
  clicks.push(clickEvent);
  await env.CLICK_ANALYTICS.put(key, JSON.stringify(clicks));

  // Also increment counters for popular servers
  const counterKey = `popular:${new Date().toISOString().slice(0, 10)}`;
  const counts = await env.CLICK_ANALYTICS.get(counterKey);
  const countMap = counts ? JSON.parse(counts) : {};
  countMap[server_id] = (countMap[server_id] || 0) + 1;
  await env.CLICK_ANALYTICS.put(counterKey, JSON.stringify(countMap));

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Get popular/trending servers
async function handlePopularServers(request, env) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `popular:${today}`;
  
  const data = await env.CLICK_ANALYTICS.get(key);
  if (!data) {
    return new Response(JSON.stringify({ servers: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const counts = JSON.parse(data);
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({ server_id: id, clicks: count }));

  return new Response(JSON.stringify({ 
    servers: sorted,
    date: today 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// AI-powered search suggestions
async function handleSuggestions(request, env) {
  const query = request.url.searchParams.get('q') || '';

  if (query.length < 2) {
    return new Response(JSON.stringify({ suggestions: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Use AI to generate suggestions based on query
  const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [
      {
        role: 'system',
        content: 'You are a Minecraft server search assistant. Given a partial search query, suggest 5 relevant completions. Return ONLY a JSON array of strings. Example: ["pvp factions server", "survival smp", "skyblock economy"]'
      },
      {
        role: 'user',
        content: `Query: "${query}"`
      }
    ]
  });

  // Parse suggestions from AI response
  let suggestions = [];
  try {
    const content = aiResponse.response;
    // Try to extract JSON array
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      suggestions = JSON.parse(match[0]);
    }
  } catch (e) {
    // Fallback to basic suggestions
    suggestions = generateFallbackSuggestions(query);
  }

  return new Response(JSON.stringify({ 
    query,
    suggestions: suggestions.slice(0, 5)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Helper functions
async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function logSearch(env, query, resultCount) {
  const key = `searches:${new Date().toISOString().slice(0, 10)}`;
  const existing = await env.CLICK_ANALYTICS.get(key);
  const searches = existing ? JSON.parse(existing) : [];
  searches.push({
    query,
    results: resultCount,
    timestamp: new Date().toISOString()
  });
  await env.CLICK_ANALYTICS.put(key, JSON.stringify(searches.slice(-1000))); // Keep last 1000
}

function generateFallbackSuggestions(query) {
  const q = query.toLowerCase();
  const common = [
    `${q} pvp server`,
    `${q} survival smp`,
    `${q} skyblock`,
    `${q} factions`,
    `${q} minigames`
  ];
  return common;
}

// Generate embeddings using Workers AI
async function handleEmbed(request, env) {
  const { text } = await request.json();
  
  if (!text) {
    return new Response(JSON.stringify({ error: 'Missing text' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [text]
    });
    
    return new Response(JSON.stringify({
      embedding: embedding.data[0],
      dimensions: embedding.data[0].length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}