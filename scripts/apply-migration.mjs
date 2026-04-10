import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wpxutsdbiampnxfgkjwq.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

async function applyMigration() {
  console.log('Applying server_embeddings migration...');
  
  // Try to create the table using raw SQL via the REST API
  try {
    // First try using the exec_sql RPC function if it exists
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS server_embeddings (
          server_id TEXT PRIMARY KEY REFERENCES servers(id) ON DELETE CASCADE,
          pinecone_id TEXT NOT NULL,
          indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_server_embeddings_indexed_at ON server_embeddings(indexed_at);
        
        ALTER TABLE server_embeddings ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow read access to server_embeddings" ON server_embeddings FOR SELECT USING (true);
        
        CREATE POLICY "Allow service role full access to server_embeddings" 
          ON server_embeddings FOR ALL 
          USING (auth.role() = 'service_role')
          WITH CHECK (auth.role() = 'service_role');
      `
    });
    
    if (rpcError) {
      console.log('RPC error:', rpcError.message);
      console.log('Migration may need to be applied manually via Supabase Dashboard');
      console.log('URL: https://supabase.com/dashboard/project/wpxutsdbiampnxfgkjwq/sql');
      console.log('\nRun this SQL:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS server_embeddings (
  server_id TEXT PRIMARY KEY REFERENCES servers(id) ON DELETE CASCADE,
  pinecone_id TEXT NOT NULL,
  indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_server_embeddings_indexed_at ON server_embeddings(indexed_at);

ALTER TABLE server_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to server_embeddings" ON server_embeddings FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to server_embeddings" 
  ON server_embeddings FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
      `);
    } else {
      console.log('✅ Migration applied successfully!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

applyMigration();
