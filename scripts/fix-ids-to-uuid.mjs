#!/usr/bin/env node
// Fix server IDs to random UUIDs (GUIDs) for unbiased ordering

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixIdsToUUIDs() {
  console.log('🔧 Converting server IDs to random UUIDs...\n');
  
  // Get all servers
  const { data: servers, error } = await supabase
    .from('servers')
    .select('id, name, created_at')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching servers:', error.message);
    return;
  }
  
  console.log(`Found ${servers.length} servers`);
  
  // Update each server with new UUID
  let updated = 0;
  
  for (const server of servers) {
    const oldId = server.id;
    const newId = randomUUID(); // Random UUID like "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    
    // Skip if already a UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(oldId)) {
      console.log(`  ⏭️  ${server.name}: Already UUID`);
      continue;
    }
    
    // Update the server
    const { error: updateError } = await supabase
      .from('servers')
      .update({ id: newId })
      .eq('id', oldId);
    
    if (updateError) {
      console.error(`  ❌ Failed to update ${server.name}:`, updateError.message);
    } else {
      updated++;
      if (updated % 100 === 0) {
        console.log(`  ✅ Updated ${updated} servers...`);
      }
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n✅ Done! Updated: ${updated} servers with random UUIDs`);
  console.log(`URLs are now: /servers/{random-uuid}`);
}

fixIdsToUUIDs().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});
