#!/usr/bin/env node
// Import scraped MC servers to Guild Post Supabase
// Generates SQL file for Supabase import

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse server address
function parseAddress(address) {
  const parts = address.split(':');
  if (parts.length === 2 && !isNaN(parts[1])) {
    return { ip: parts[0], port: parseInt(parts[1]) };
  }
  return { ip: address, port: 25565 };
}

// Generate readable name
function generateName(address) {
  const domain = address.split(':')[0];
  const parts = domain.split('.');
  
  // Hosting patterns
  if (domain.includes('aternos.me')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Aternos)';
  }
  if (domain.includes('minehut.gg')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Minehut)';
  }
  if (domain.includes('exaroton.me')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Exaroton)';
  }
  if (domain.includes('hostify.cz')) {
    return parts[0].replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' (Hostify)';
  }
  
  // Normal domains
  const skipPrefixes = ['play', 'mc', 'hub', 'join', 'srv', 'ms', 'org', 'craft', 'server'];
  let namePart = parts[0];
  
  if (skipPrefixes.includes(namePart.toLowerCase()) && parts.length > 2) {
    namePart = parts[1];
  }
  
  return namePart
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/mc$/i, 'MC')
    .replace(/smp$/i, 'SMP')
    .replace(/pvp$/i, 'PvP')
    .replace(/cz$/i, 'CZ')
    .replace(/sk$/i, 'SK')
    .replace(/eu$/i, 'EU');
}

// Guess tags
function guessTags(address, name) {
  const tags = [];
  const lower = (address + ' ' + name).toLowerCase();
  
  if (lower.includes('survival') || lower.includes('smp')) tags.push('Survival');
  if (lower.includes('skyblock')) tags.push('Skyblock');
  if (lower.includes('faction')) tags.push('Factions');
  if (lower.includes('pvp')) tags.push('PvP');
  if (lower.includes('prison')) tags.push('Prison');
  if (lower.includes('minigame')) tags.push('Minigames');
  if (lower.includes('creative')) tags.push('Creative');
  if (lower.includes('pixelmon') || lower.includes('cobblemon')) tags.push('Pixelmon');
  if (lower.includes('hardcore')) tags.push('Hardcore');
  if (lower.includes('anarchy')) tags.push('Anarchy');
  if (lower.includes('rpg')) tags.push('RPG');
  if (lower.includes('mod')) tags.push('Modded');
  if (lower.includes('bedwars')) tags.push('Bedwars');
  
  // Hosting
  if (lower.includes('aternos')) tags.push('Aternos');
  if (lower.includes('minehut')) tags.push('Minehut');
  if (lower.includes('exaroton')) tags.push('Exaroton');
  
  // Default
  if (tags.length === 0) tags.push('Multiplayer');
  
  return tags.slice(0, 4);
}

// Generate description
function generateDescription(name, tags) {
  const type = tags[0] || 'Multiplayer';
  const descriptions = [
    `Join ${name} for an epic Minecraft ${type.toLowerCase()} experience!`,
    `${name} - The ultimate ${type.toLowerCase()} adventure awaits.`,
    `Discover ${name} - A ${type.toLowerCase()} server with a friendly community.`,
    `Play on ${name} with friends! ${type} gameplay.`,
    `${name} server featuring ${tags.join(', ')}.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function main() {
  console.log('🚀 Generating SQL import for Guild Post\n');
  
  // Read server list
  const filePath = join(__dirname, '..', '..', 'mc_servers_clean.txt');
  const content = readFileSync(filePath, 'utf-8');
  const addresses = content.split('\n').filter(line => line.trim());
  
  console.log(`📋 Found ${addresses.length} servers\n`);
  
  // Generate SQL
  const servers = addresses.map((address, index) => {
    const { ip, port } = parseAddress(address);
    const name = generateName(address);
    const tags = guessTags(address, name);
    const description = generateDescription(name, tags);
    
    return {
      id: `scraped-${String(index + 1).padStart(3, '0')}`,
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
      created_at: new Date().toISOString()
    };
  });
  
  // Generate SQL insert statements
  let sql = '-- Guild Post - Import 318 Scraped MC Servers\n';
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;
  sql += 'INSERT INTO servers (id, ip, port, name, description, version, tags, edition, verified, vote_count, players_online, max_players, status, created_at) VALUES\n';
  
  const values = servers.map((s, i) => {
    const tagsArray = s.tags.map(t => `"${t}"`).join(',');
    const isLast = i === servers.length - 1;
    return `  ('${s.id}', '${s.ip}', ${s.port}, '${s.name.replace(/'/g, "''")}', '${s.description.replace(/'/g, "''")}', '${s.version}', ARRAY[${tagsArray}], '${s.edition}', ${s.verified}, ${s.vote_count}, ${s.players_online}, ${s.max_players}, '${s.status}', '${s.created_at}')${isLast ? ';' : ','}`;
  });
  
  sql += values.join('\n');
  
  // Save SQL file
  const sqlFile = join(__dirname, '..', '..', 'import_servers_318.sql');
  writeFileSync(sqlFile, sql);
  
  // Also save as JSON
  const jsonFile = join(__dirname, '..', '..', 'import_servers_318.json');
  writeFileSync(jsonFile, JSON.stringify({
    total: servers.length,
    generated_at: new Date().toISOString(),
    servers
  }, null, 2));
  
  console.log(`✅ Generated files:`);
  console.log(`  📄 SQL: ${sqlFile}`);
  console.log(`  📄 JSON: ${jsonFile}\n`);
  
  console.log(`📝 Sample servers:`);
  servers.slice(0, 10).forEach(s => {
    console.log(`  - ${s.name} (${s.ip}:${s.port}) [${s.tags.join(', ')}]`);
  });
  console.log(`  ... and ${servers.length - 10} more\n`);
  
  console.log(`📥 To import into Supabase:`);
  console.log(`  1. Go to https://app.supabase.com/project/wpxutsdbiampnxfgkjwq`);
  console.log(`  2. Open SQL Editor`);
  console.log(`  3. Copy/paste the SQL file contents`);
  console.log(`  4. Run the query\n`);
}

main();
