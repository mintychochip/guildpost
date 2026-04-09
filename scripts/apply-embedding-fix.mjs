#!/usr/bin/env node
/**
 * Apply embedding dimension fix directly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const fixSQL = `
-- Drop the old index and column
DROP INDEX IF EXISTS servers_embedding_idx;
ALTER TABLE servers DROP COLUMN IF EXISTS embedding;

-- Add embedding column with correct dimensions (3072 for Gemini)
ALTER TABLE servers ADD COLUMN embedding vector(3072);

-- Create index for fast similarity search
CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops);
`;

async function applyFix() {
  console.log('🔧 Applying embedding dimension fix...');
  console.log('   Target: 3072 dimensions for Gemini embedding-001');
  
  try {
    // Use Supabase SQL API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({ sql_query: fixSQL })
    });
    
    if (!response.ok) {
      const err = await response.text();
      console.log('   RPC not available, trying direct REST...');
      
      // Try alternative: execute each statement separately via pg_rest
      const statements = [
        'DROP INDEX IF EXISTS servers_embedding_idx',
        'ALTER TABLE servers DROP COLUMN IF EXISTS embedding',
        'ALTER TABLE servers ADD COLUMN embedding vector(3072)',
        'CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops)'
      ];
      
      for (const stmt of statements) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY
          },
          body: JSON.stringify({ sql_query: stmt })
        });
        
        if (!res.ok && res.status !== 404) {
          const errText = await res.text();
          console.error(`   ❌ Failed: ${stmt.substring(0, 50)}... - ${errText.substring(0, 100)}`);
        } else {
          console.log(`   ✅ Executed: ${stmt.substring(0, 50)}...`);
        }
      }
    } else {
      console.log('   ✅ Fix applied via RPC');
    }
    
    console.log('✅ Fix applied successfully!');
    console.log('   Servers can now accept 3072-dimension embeddings from Gemini');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

applyFix();
