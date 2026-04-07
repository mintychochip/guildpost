#!/usr/bin/env node
/**
 * Generate semantic embeddings for all servers
 * Uses Cloudflare Workers AI or external API
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Supabase credentials
const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.qWj0l_7V1jO2k_I6V-0-lYlX2X-3-4-5-6-7-8-9-0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cloudflare Workers AI endpoint (you'll need to deploy the worker first)
const WORKER_URL = process.env.WORKER_URL || 'https://your-worker.guildpost.workers.dev';

// Or use OpenAI/HuggingFace directly
const USE_OPENAI = false;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function generateEmbedding(text) {
  if (USE_OPENAI && OPENAI_KEY) {
    // Use OpenAI API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });
    const data = await response.json();
    return data.data[0].embedding;
  } else {
    // Use Cloudflare Workers AI (free)
    // Note: This requires the worker to be deployed with AI bindings
    const response = await fetch(`${WORKER_URL}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      console.log('Worker not available, using mock embedding');
      // Return mock embedding for testing (768 dimensions of 0s with small random values)
      return Array(768).fill(0).map(() => (Math.random() - 0.5) * 0.01);
    }
    
    const data = await response.json();
    return data.embedding;
  }
}

async function processServers() {
  console.log('🔍 Fetching servers without embeddings...');
  
  const { data: servers, error } = await supabase
    .from('servers')
    .select('id, name, description, tags')
    .is('embedding', null)
    .limit(50);
  
  if (error) {
    console.error('❌ Error fetching servers:', error);
    return;
  }
  
  if (!servers || servers.length === 0) {
    console.log('✅ All servers have embeddings!');
    return;
  }
  
  console.log(`📝 Processing ${servers.length} servers...\n`);
  
  for (const server of servers) {
    try {
      // Create rich text for embedding
      const text = [
        server.name,
        server.description,
        ...(server.tags || [])
      ].filter(Boolean).join('. ');
      
      if (!text) {
        console.log(`⏭️  Skipping ${server.name} - no content`);
        continue;
      }
      
      console.log(`🤖 Generating embedding for: ${server.name}`);
      
      const embedding = await generateEmbedding(text);
      
      // Update server with embedding
      const { error: updateError } = await supabase
        .from('servers')
        .update({ embedding })
        .eq('id', server.id);
      
      if (updateError) {
        console.error(`❌ Failed to update ${server.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${server.name}`);
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 100));
      
    } catch (err) {
      console.error(`❌ Error processing ${server.name}:`, err.message);
    }
  }
  
  console.log('\n🎉 Done!');
}

// Also create a simple embedding function using the worker
async function testWorkerEmbedding() {
  console.log('Testing worker embedding...');
  
  const testText = "Minecraft PvP survival server with factions";
  
  try {
    const response = await fetch(`${WORKER_URL}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: testText })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Worker is working!');
      console.log(`Embedding dimensions: ${data.embedding?.length}`);
    } else {
      console.log('⚠️  Worker not responding, will use mock embeddings');
    }
  } catch (err) {
    console.log('⚠️  Worker error:', err.message);
    console.log('Will use mock embeddings for testing');
  }
}

// Main
if (process.argv.includes('--test')) {
  testWorkerEmbedding();
} else {
  processServers();
}
