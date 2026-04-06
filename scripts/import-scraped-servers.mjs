// Import scraped MC servers into Guild Post Supabase
// Uses the 318 servers from mc_servers_clean.txt

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwMDQsImV4cCI6MjA5MDkyNzAwNH0.FUiWKe-SwTnKEQFmVzN4L46E5gP2qXl1MnEkrzjWfSw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse server address to extract IP and port
function parseAddress(address) {
  const parts = address.split(':');
  if (parts.length === 2) {
    return { ip: parts[0], port: parseInt(parts[1]) };
  }
  return { ip: address, port: 25565 };
}

// Generate a readable name from domain
function generateName(address) {
  // Remove port if present
  const domain = address.split(':')[0];
  
  // Extract meaningful part
  const parts = domain.split('.');
  
  // Common patterns
  if (domain.includes('aternos.me')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Aternos)';
  }
  if (domain.includes('minehut.gg')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Minehut)';
  }
  if (domain.includes('exaroton.me')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Exaroton)';
  }
  
  // For normal domains, use the main part
  if (parts.length >= 2) {
    // Skip common prefixes
    const skipPrefixes = ['play', 'mc', 'hub', 'join', 'srv', 'ms', 'org', 'craft', 'server'];
    let namePart = parts[0];
    
    if (skipPrefixes.includes(namePart.toLowerCase()) && parts.length > 2) {
      namePart = parts[1];
    }
    
    // Clean and capitalize
    return namePart
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/mc$/i, 'MC')
      .replace(/smp$/i, 'SMP');
  }
  
  return domain;
}

// Guess tags from domain/name
function guessTags(address, name) {
  const tags = [];
  const lower = (address + ' ' + name).toLowerCase();
  
  // Game modes
  if (lower.includes('survival') || lower.includes('smp')) tags.push('Survival');
  if (lower.includes('skyblock')) tags.push('Skyblock');
  if (lower.includes('faction')) tags.push('Factions');
  if (lower.includes('pvp')) tags.push('PvP');
  if (lower.includes('prison')) tags.push('Prison');
  if (lower.includes('minigame')) tags.push('Minigames');
  if (lower.includes('creative')) tags.push('Creative');
  if (lower.includes('mod')) tags.push('Modded');
  if (lower.includes('pixelmon') || lower.includes('cobblemon')) tags.push('Pixelmon');
  if (lower.includes('hardcore')) tags.push('Hardcore');
  if (lower.includes('anarchy')) tags.push('Anarchy');
  if (lower.includes('rpg')) tags.push('RPG');
  
  // Hosting
  if (lower.includes('aternos')) tags.push('Aternos');
  if (lower.includes('minehut')) tags.push('Minehut');
  if (lower.includes('exaroton')) tags.push('Exaroton');
  
  // Default
  if (tags.length === 0) {
    tags.push('Multiplayer');
  }
  
  return tags.slice(0, 4); // Max 4 tags
}

// Generate description
function generateDescription(name, tags) {
  const descriptions = [
    `Join ${name} for an epic Minecraft experience!`,
    `${name} - Where adventure awaits.`,
    `Discover ${name} - ${tags.join(', ')} server.`,
    `Play on ${name} with friends!`,
    `${name} server with ${tags.join(', ')}.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

async function importServers() {
  console.log('🚀 Importing scraped servers to Guild Post\n');
  
  // Read the server list
  const filePath = join(__dirname, '..', '..', 'mc_servers_clean.txt');
  const content = readFileSync(filePath, 'utf-8');
  const addresses = content.split('\n').filter(line => line.trim());
  
  console.log(`📋 Found ${addresses.length} servers to import\n`);
  
  // Convert to server objects
  const servers = addresses.map((address, index) => {
    const { ip, port } = parseAddress(address);
    const name = generateName(address);
    const tags = guessTags(address, name);
    const description = generateDescription(name, tags);
    
    return {
      id: `scraped-${index + 1}-${Date.now()}`,
      ip,
      port,
      name,
      description,
      version: '1.20+',
      tags,
      edition: 'java',
      verified: false,
      vote_count: 0,
      players_online: 0,
      max_players: 100,
      status: 'unknown',
      icon: null,
      banner: null,
      source: 'scraped',
      created_at: new Date().toISOString()
    };
  });
  
  // Check for existing IPs to avoid duplicates
  const { data: existing, error: existingError } = await supabase
    .from('servers')
    .select('ip');
  
  if (existingError) {
    console.error('❌ Error checking existing servers:', existingError.message);
    return;
  }
  
  const existingIps = new Set(existing?.map(s => s.ip) || []);
  const newServers = servers.filter(s => !existingIps.has(s.ip));
  
  console.log(`📊 ${servers.length} total, ${newServers.length} new (skipped ${servers.length - newServers.length} duplicates)\n`);
  
  if (newServers.length === 0) {
    console.log('✅ All servers already in database!');
    return;
  }
  
  // Insert in batches
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < newServers.length; i += batchSize) {
    const batch = newServers.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('servers')
      .insert(batch);
    
    if (error) {
      console.error(`  ❌ Batch ${i / batchSize + 1} failed:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  ✅ Batch ${i / batchSize + 1}: ${batch.length} servers`);
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n🎉 DONE! Imported ${inserted} servers into Guild Post`);
  console.log(`📈 Total database size: ${existing?.length + inserted || inserted} servers`);
}

importServers().catch(err => {
  console.error('💥 Import failed:', err);
  process.exit(1);
});
