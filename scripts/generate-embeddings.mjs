#!/usr/bin/env node
/**
 * Generate semantic embeddings for all servers using Mixedbread AI
 * Mixedbread uses 768 dimensions which matches our pgvector setup
 */

import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Mixedbread API - 768 dimensions
const MIXEDBREAD_API_KEY = process.env.MIXEDBREAD_API_KEY;

if (!SUPABASE_SERVICE_KEY || !MIXEDBREAD_API_KEY) {
  console.error('❌ Missing required env vars:');
  console.error('   SUPABASE_SERVICE_KEY - Get from Supabase dashboard');
  console.error('   MIXEDBREAD_API_KEY - Get from https://mixedbread.ai');
  console.error('\nUsage: SUPABASE_SERVICE_KEY=xxx MIXEDBREAD_API_KEY=xxx node generate-embeddings.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateEmbedding(text) {
  // Use Mixedbread API (768 dimensions)
  const response = await fetch('https://api.mixedbread.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MIXEDBREAD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mixedbread-ai/mxbai-embed-large-v1',
      input: text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mixedbread API error: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function processServers() {
  console.log('🔍 Fetching servers without embeddings...');
  
  const { data: servers, error, count } = await supabase
    .from('servers')
    .select('id, name, description, tags', { count: 'exact' })
    .is('embedding', null)
    .limit(100);
  
  if (error) {
    console.error('❌ Error fetching servers:', error);
    return;
  }
  
  console.log(`📊 Total servers: ${count}`);
  console.log(`📊 Servers without embeddings: ${servers?.length || 0}\n`);
  
  if (!servers || servers.length === 0) {
    console.log('✅ All servers have embeddings!');
    return;
  }
  
  console.log(`📝 Processing ${servers.length} servers...\n`);
  
  let processed = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const server of servers) {
    try {
      // Create rich text for embedding
      const text = [
        server.name,
        server.description,
        ...(server.tags || [])
      ].filter(Boolean).join('. ');
      
      if (!text || text.length < 5) {
        console.log(`⏭️  Skipping ${server.name} - no content`);
        skipped++;
        continue;
      }
      
      console.log(`🤖 [${processed + failed + skipped + 1}/${servers.length}] ${server.name?.substring(0, 40)}...`);
      
      const embedding = await generateEmbedding(text);
      
      if (!embedding || embedding.length === 0) {
        console.error(`   ❌ Empty embedding returned`);
        failed++;
        continue;
      }
      
      console.log(`   📐 Dimensions: ${embedding.length}`);
      
      // Update server with embedding
      const { error: updateError } = await supabase
        .from('servers')
        .update({ embedding })
        .eq('id', server.id);
      
      if (updateError) {
        console.error(`   ❌ Failed to update:`, updateError.message);
        failed++;
      } else {
        console.log(`   ✅ Updated`);
        processed++;
      }
      
      // Rate limiting - be nice to the API
      await new Promise(r => setTimeout(r, 200));
      
    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
      failed++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  console.log(`\n🎉 Done! Processed: ${processed}, Failed: ${failed}, Skipped: ${skipped}`);
  
  // Show final status
  const { data: status } = await supabase
    .from('servers')
    .select('embedding', { count: 'exact' });
  
  const withEmb = status?.filter(s => s.embedding).length || 0;
  const total = status?.length || 0;
  console.log(`📊 Total embeddings in DB: ${withEmb}/${total}`);
}

// Test Mixedbread API
async function testEmbedding() {
  console.log('🧪 Testing Mixedbread embedding...\n');
  
  try {
    const embedding = await generateEmbedding("Minecraft PvP survival server with factions and economy");
    console.log(`\n✅ Mixedbread works! Dimensions: ${embedding.length}`);
    console.log(`   Sample values: ${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...`);
    return true;
  } catch (err) {
    console.error(`\n❌ Mixedbread test failed:`, err.message);
    process.exit(1);
  }
}

// Show status
async function showStatus() {
  const { data, error, count } = await supabase
    .from('servers')
    .select('embedding', { count: 'exact' });
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  const withEmb = data?.filter(s => s.embedding).length || 0;
  const total = count || data?.length || 0;
  console.log(`📊 Embedding status: ${withEmb}/${total} servers have embeddings`);
  
  if (withEmb < total) {
    console.log(`   Run without --status to generate embeddings for ${total - withEmb} remaining servers`);
  }
}

// Main
if (process.argv.includes('--test')) {
  testEmbedding();
} else if (process.argv.includes('--status')) {
  showStatus();
} else {
  testEmbedding().then(() => processServers());
}
