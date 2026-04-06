#!/usr/bin/env node
// Fix server IDs to be simple numerical format (1, 2, 3...)
// Updates existing servers from "server-0001" to "1"

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixIds() {
  console.log('🔧 Fixing server IDs to numerical format...\n');
  
  // Get all servers
  const { data: servers, error } = await supabase
    .from('servers')
    .select('id, name')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching servers:', error.message);
    return;
  }
  
  console.log(`Found ${servers.length} servers`);
  
  // Update each server with new numerical ID
  let updated = 0;
  let skipped = 0;
  
  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    const oldId = server.id;
    const newId = (i + 1).toString(); // "1", "2", "3"...
    
    // Skip if already numerical
    if (/^\d+$/.test(oldId)) {
      skipped++;
      continue;
    }
    
    // Update the server
    const { error: updateError } = await supabase
      .from('servers')
      .update({ id: newId })
      .eq('id', oldId);
    
    if (updateError) {
      console.error(`  ❌ Failed to update ${oldId}:`, updateError.message);
    } else {
      updated++;
      if (updated % 100 === 0) {
        console.log(`  ✅ Updated ${updated} servers...`);
      }
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
  console.log(`Servers now have IDs: 1, 2, 3, ..., ${servers.length}`);
}

fixIds().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});
