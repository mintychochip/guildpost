#!/usr/bin/env node
// Quick test to check if servers are in Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwMDQsImV4cCI6MjA5MDkyNzAwNH0.FUiWKe-SwTnKEQFmVzN4L46E5gP2qXl1MnEkrzjWfSw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('Testing Supabase connection...\n');
  
  // Try to get server count
  const { data, error, count } = await supabase
    .from('servers')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. RLS policy blocking anon access');
    console.log('2. Table does not exist');
    console.log('3. Network/CORS issue');
    return;
  }
  
  console.log('✅ Connection successful!');
  console.log(`📊 Total servers: ${count || data?.length || 0}`);
  
  if (data && data.length > 0) {
    console.log('\n📝 Sample servers:');
    data.slice(0, 5).forEach(s => {
      console.log(`  - ${s.name} (${s.ip}:${s.port})`);
    });
  }
}

test();
