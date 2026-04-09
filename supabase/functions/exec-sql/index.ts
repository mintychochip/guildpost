import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  // Only allow service role
  const authHeader = req.headers.get('Authorization');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      serviceKey || ''
    );

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS server_embeddings (
          server_id UUID PRIMARY KEY REFERENCES servers(id) ON DELETE CASCADE,
          pinecone_id TEXT NOT NULL,
          indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_server_embeddings_indexed_at ON server_embeddings(indexed_at);
        ALTER TABLE server_embeddings ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow service role full access to server_embeddings"
          ON server_embeddings FOR ALL
          USING (auth.role() = 'service_role')
          WITH CHECK (auth.role() = 'service_role');
      `
    });

    if (error) {
      // Try direct SQL via query
      const { error: queryError } = await supabase.from('servers').select('count', { count: 'exact', head: true });
      
      // If we get here, just try raw SQL through the REST API directly
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey || '',
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `CREATE TABLE IF NOT EXISTS server_embeddings (server_id UUID PRIMARY KEY, pinecone_id TEXT, indexed_at TIMESTAMP)`
        })
      });
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message,
        queryError: queryError?.message,
        rawResponse: await response.text()
      }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
