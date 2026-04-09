#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdranVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTc2MjcsImV4cCI6MjA1Njk5MzYyN30.XaFuWwxlP8W1QCdKbUGPzlFHLr3aoLCwjcaF4oNhrAo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkStatus() {
  // Try RPC first
  try {
    const { data: rpcResult, error: rpcErr } = await supabase
      .rpc('match_servers', { 
        query_embedding: Array(3072).fill(0),
        match_threshold: 0.0,
        match_count: 1 
      });
    console.log('RPC test:', rpcErr ? 'Error: ' + rpcErr.message : 'Available');
  } catch (e) {
    console.log('RPC not available');
  }

  // Get total count
  const { count: total, error: totalErr } = await supabase
    .from('servers')
    .select('*', { count: 'exact', head: true });
  
  if (totalErr) {
    console.error('Error:', totalErr);
    return;
  }
  
  // Sample 100 servers to estimate completion
  const { data: sample, error: sampleErr } = await supabase
    .from('servers')
    .select('id, name, embedding')
    .limit(100);
    
  if (sampleErr) {
    console.error('Sample error:', sampleErr);
    return;
  }
  
  const withEmb = sample.filter(s => s.embedding).length;
  const withoutEmb = sample.filter(s => !s.embedding).length;
  
  console.log(`📊 Total servers: ${total}`);
  console.log(`📊 Sample (100 servers): ${withEmb} with embeddings, ${withoutEmb} without`);
  console.log(`📊 Estimated complete: ~${Math.round((withEmb / 100) * total)}/${total} (${Math.round((withEmb / 100) * 100)}%)`);
  console.log(`📊 Estimated remaining: ~${Math.round((withoutEmb / 100) * total)} servers`);
  
  // Show a few examples without embeddings
  const needsEmb = sample.filter(s => !s.embedding).slice(0, 3);
  if (needsEmb.length > 0) {
    console.log('\n📝 Servers needing embeddings:');
    needsEmb.forEach(s => console.log(`   - ${s.name}`));
  }
}

checkStatus();
