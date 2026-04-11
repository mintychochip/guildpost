#!/usr/bin/env node
// Import thousands of scraped servers

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BAD_DOMAINS = [
  'minecraft.net', 'mojang.com', 'google.com', 'facebook.com', 'twitter.com',
  'discord.com', 'youtube.com', 'github.com', 'org.mc', 'complex.com', 
  '.png', '.jpg', '.com.com'
];

function isValid(ip) {
  if (!ip || ip.length < 5) return false;
  if (!ip.includes('.')) return false;
  if (ip.split('.').length < 2) return false;
  if (BAD_DOMAINS.some(bad => ip.includes(bad))) return false;
  if (ip.endsWith('.')) return false;
  return true;
}

function cleanName(ip) {
  const parts = ip.split('.');
  // Get meaningful part
  let name = parts[0];
  if (['play', 'mc', 'hub', 'join', 'srv', 'server'].includes(name) && parts.length > 1) {
    name = parts[1];
  }
  return name
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .substring(0, 30);
}

function guessTags(ip) {
  const tags = ['Multiplayer'];
  const lower = ip.toLowerCase();
  if (lower.includes('pvp')) tags.push('PvP');
  if (lower.includes('survival') || lower.includes('smp')) tags.push('Survival');
  if (lower.includes('skyblock')) tags.push('Skyblock');
  if (lower.includes('prison')) tags.push('Prison');
  if (lower.includes('minigame')) tags.push('Minigames');
  if (lower.includes('pixelmon') || lower.includes('cobblemon')) tags.push('Pixelmon');
  if (lower.includes('creative')) tags.push('Creative');
  return tags.slice(0, 3);
}

async function importServers() {
  console.log('🚀 Importing thousands of servers...\n');
  
  const data = JSON.parse(readFileSync('./aggressive_2026-04-11T18-27-22.json'));
  let servers = data.servers.filter(s => isValid(s.ip));
  
  console.log(`📋 Total servers from scraper: ${data.total}`);
  console.log(`✅ Valid after filtering: ${servers.length}`);
  
  // Check existing
  const { data: existing } = await supabase.from('servers').select('ip');
  const existingIps = new Set(existing?.map(s => s.ip) || []);
  
  // Filter new
  const newServers = servers.filter(s => !existingIps.has(s.ip));
  console.log(`🆕 New servers to import: ${newServers.length}`);
  
  if (newServers.length === 0) {
    console.log('✅ All servers already in database!');
    return;
  }
  
  // Prepare records
  const records = newServers.map((s, i) => ({
    id: `mass-${Date.now()}-${i}`,
    ip: s.ip,
    port: s.port || 25565,
    name: cleanName(s.ip),
    description: `Join ${cleanName(s.ip)} Minecraft server!`,
    version: '1.20+',
    tags: guessTags(s.ip),
    edition: 'java',
    verified: false,
    vote_count: 0,
    players_online: 0,
    max_players: 100,
    status: 'unknown',
    created_at: new Date().toISOString()
  }));
  
  // Insert in batches
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase.from('servers').insert(batch);
    
    if (error) {
      console.error(`❌ Batch ${i/batchSize + 1}: ${error.message}`);
    } else {
      inserted += batch.length;
      process.stdout.write(`\r  ✅ Progress: ${inserted}/${records.length}`);
    }
    
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\n\n🎉 Imported ${inserted} servers!`);
  console.log(`📈 Database now has ~${(existing?.length || 0) + inserted} servers`);
}

importServers().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});
