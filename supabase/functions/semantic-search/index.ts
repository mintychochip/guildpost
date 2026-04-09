import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Pinecone client for Deno
class PineconeClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = '';
  }

  index(name: string) {
    this.baseUrl = `https://${name}-7tsdr5f.svc.aped-4627-b74a.pinecone.io`;
    return {
      query: async (params: {
        vector: number[];
        topK: number;
        includeMetadata?: boolean;
        filter?: Record<string, any>;
      }) => {
        const response = await fetch(`${this.baseUrl}/query`, {
          method: 'POST',
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vector: params.vector,
            topK: params.topK,
            includeMetadata: params.includeMetadata,
            filter: params.filter
          })
        });

        if (!response.ok) {
          throw new Error(`Pinecone error: ${await response.text()}`);
        }

        return await response.json();
      }
    };
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Generate embedding using Mixedbread
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.mixedbread.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixedbread-ai/mxbai-embed-large-v1',
      input: text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mixedbread API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const pineconeKey = Deno.env.get('PINECONE_API_KEY') || '';
    const mixedbreadKey = Deno.env.get('MIXEDBREAD_API_KEY') || '';
    const pineconeIndex = Deno.env.get('PINECONE_INDEX') || 'guildpost-servers';

    if (!supabaseKey || !pineconeKey || !mixedbreadKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required environment variables' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    // Parse request body
    const { query, limit = 10, filters = {} } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query parameter required' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log(`🔍 Semantic search: "${query}"`);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, mixedbreadKey);
    console.log(`📐 Generated ${queryEmbedding.length}-dim embedding`);

    // Query Pinecone
    const pinecone = new PineconeClient(pineconeKey);
    const index = pinecone.index(pineconeIndex);

    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
      filter: Object.keys(filters).length > 0 ? filters : undefined
    });

    console.log(`✅ Pinecone returned ${searchResults.matches?.length || 0} matches`);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return new Response(
        JSON.stringify({ 
          query, 
          results: [], 
          count: 0,
          message: 'No similar servers found'
        }),
        { headers: corsHeaders }
      );
    }

    // Get server IDs from Pinecone results
    const serverIds = searchResults.matches.map(m => m.id);
    const scores = new Map(searchResults.matches.map(m => [m.id, m.score]));

    // Fetch full server data from Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: servers, error: dbError } = await supabase
      .from('servers')
      .select('id, name, description, ip, port, status, players_online, max_players, version, tags, banner_url, votes, server_type, game_type')
      .in('id', serverIds);

    if (dbError) {
      throw dbError;
    }

    // Merge Pinecone scores with server data
    const results = (servers || [])
      .map(server => ({
        ...server,
        similarity_score: scores.get(server.id) || 0
      }))
      .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));

    return new Response(
      JSON.stringify({
        query,
        results,
        count: results.length,
        semantic: true
      }),
      { headers: corsHeaders }
    );

  } catch (err) {
    console.error('❌ Search error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
