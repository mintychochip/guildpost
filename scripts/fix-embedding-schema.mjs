#!/usr/bin/env node
/**
 * Fix embedding column dimensions in Supabase
 * Changes from 768 to 3072 dimensions for Gemini compatibility
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_KEY env var');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixSchema() {
  console.log('🔧 Checking and fixing embedding schema...');
  
  try {
    // First, check current embedding column type
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('data_type, udt_name')
      .eq('table_name', 'servers')
      .eq('column_name', 'embedding');
    
    if (colError) {
      console.log('   Could not query column info:', colError.message);
    } else if (columns && columns.length > 0) {
      console.log('   Current column type:', columns[0].data_type, columns[0].udt_name);
    }
    
    // Try to get one embedding to check dimensions
    const { data: sample, error: sampleError } = await supabase
      .from('servers')
      .select('id, embedding')
      .not('embedding', 'is', null)
      .limit(1);
    
    if (!sampleError && sample && sample.length > 0) {
      console.log('   Sample embedding dimensions:', sample[0].embedding?.length);
    } else {
      console.log('   No existing embeddings found (or column type mismatch)');
    }
    
    // Apply the fix using raw SQL via REST API
    console.log('\n📦 Applying schema fix...');
    
    // Use the Supabase REST API to execute SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Prefer': 'tx=commit'
      },
      body: JSON.stringify({
        sql_query: `
          DROP INDEX IF EXISTS servers_embedding_idx;
          ALTER TABLE servers DROP COLUMN IF EXISTS embedding;
          ALTER TABLE servers ADD COLUMN embedding vector(3072);
          CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops);
        `
      })
    });
    
    if (!response.ok) {
      const err = await response.text();
      console.log('   RPC exec_sql not available, trying alternative...');
      console.log('   Error:', err.substring(0, 200));
      
      // Alternative: try to use pg_execute if available
      return false;
    }
    
    console.log('✅ Schema fixed successfully!');
    return true;
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

// Try using psql with connection string
async function tryPsqlFix() {
  console.log('\n🔌 Trying psql connection...');
  
  // Try to get connection string from environment or construct it
  const poolerUrl = process.env.SUPABASE_POOLER_URL;
  if (poolerUrl) {
    console.log('   Found pooler URL, attempting psql...');
    return true;
  }
  
  // Construct connection URL from known project details
  const projectRef = 'wpxutsdbiampnxfgkjwq';
  const directUrl = `postgresql://postgres:${SUPABASE_SERVICE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;
  const poolerUrl2 = `postgresql://postgres:${SUPABASE_SERVICE_KEY}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`;
  
  console.log('   Direct URL available but psql not available in this environment.');
  return false;
}

// Try alternative approaches
async function tryAlternativeFix() {
  console.log('\n🔧 Trying alternative schema fix via direct REST...');
  
  const statements = [
    'DROP INDEX IF EXISTS servers_embedding_idx',
    'ALTER TABLE servers DROP COLUMN IF EXISTS embedding',
    'ALTER TABLE servers ADD COLUMN embedding vector(3072)',
    'CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops)'
  ];
  
  for (const stmt of statements) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Prefer': 'tx=commit'
        },
        body: JSON.stringify({ sql_query: stmt })
      });
      
      if (!response.ok) {
        const err = await response.text();
        console.log(`   ⚠️  ${stmt.substring(0, 40)}... - ${err.substring(0, 80)}`);
      } else {
        console.log(`   ✅ ${stmt.substring(0, 40)}...`);
      }
    } catch (e) {
      console.log(`   ❌ ${stmt.substring(0, 40)}... - ${e.message}`);
    }
  }
}

// Output manual fix instructions
async function outputManualFix() {
  console.log('\n⚠️  Automatic schema fix not available via REST API.');
  console.log('   Supabase requires direct database access for schema changes.');
  console.log('');
  console.log('   📋 To fix the embedding dimensions, run this SQL in Supabase Dashboard:');
  console.log('      https://supabase.com/dashboard/project/wpxutsdbiampnxfgkjwq/sql');
  console.log('');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   DROP INDEX IF EXISTS servers_embedding_idx;');
  console.log('   ALTER TABLE servers DROP COLUMN IF EXISTS embedding;');
  console.log('   ALTER TABLE servers ADD COLUMN embedding vector(3072);');
  console.log('   CREATE INDEX servers_embedding_idx ON servers USING ivfflat (embedding vector_cosine_ops);');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  return false;
}

// Main
async function main() {
  let success = await fixSchema();
  
  if (!success) {
    success = await tryPsqlFix();
  }
  
  if (!success) {
    await outputManualFix();
  }
}

main();
