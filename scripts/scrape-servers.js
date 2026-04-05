#!/usr/bin/env node
/**
 * pvpserverlist - Server Scraper & SQL Generator
 * 
 * 1. Loads curated server data from pvp-servers.json
 * 2. Tries to scrape additional PvP servers from public server lists
 * 3. Deduplicates by IP
 * 4. Outputs SQL seed file (pvp-servers-data.sql)
 *
 * Usage: node scripts/scrape-servers.js
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const SERVERS_JSON = path.join(__dirname, 'pvp-servers.json');
const OUTPUT_FILE = path.join(__dirname, 'pvp-servers-data.sql');
const REQUEST_DELAY = 1500;
const MAX_PAGES_PER_SOURCE = 10;

// ── HTTP Helper ──────────────────────────────────────────
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchHTML(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      if (i < retries - 1) await delay(2000);
    }
  }
  return null;
}

// ── Load curated servers ─────────────────────────────────
function loadCuratedServers() {
  const raw = fs.readFileSync(SERVERS_JSON, 'utf-8');
  const data = JSON.parse(raw);
  return data.map(s => ({
    name: s.n,
    ip: s.i,
    port: 25565,
    version: s.v,
    tags: s.t,
    verified: false,
    vote_count: s.votes,
    description: `${s.n} - ${s.t.slice(0, 3).join(' / ')} server.`,
  }));
}

// ── Scrape minecraft-mp.com ─────────────────────────────
async function scrapeMinecraftMP(existingIPs) {
  console.log('\n🔍 Scraping minecraft-mp.com...');
  const servers = [];

  // Try PvP category page
  const categories = ['pvp'];

  for (const cat of categories) {
    for (let page = 1; page <= MAX_PAGES_PER_SOURCE; page++) {
      const pageUrl = page === 1
        ? `https://minecraft-mp.com/type/${cat}/`
        : `https://minecraft-mp.com/type/${cat}/?page=${page}`;

      console.log(`  Page ${page}: ${pageUrl.replace(/\?page=\d+/, '?page=N')}`);
      const html = await fetchHTML(pageUrl);

      if (!html) {
        console.log(`  ✗ Failed to fetch page ${page}`);
        if (page === 1) break; else break;
      }

      if (html.includes('Cloudflare') || html.includes('cf-chl-') || html.includes('attention required')) {
        console.log('  ✗ Blocked by Cloudflare');
        break;
      }

      const $ = cheerio.load(html);
      let found = 0;

      // Pattern: server cards with server info
      // Try multiple selector strategies
      $('tr').each((_, row) => {
        const $row = $(row);
        const links = $row.find('a');
        const text = $row.text();

        // Look for server IP patterns and names
        let name = '';
        let ip = '';
        let version = '';

        links.each((_, link) => {
          const $link = $(link);
          const href = $link.attr('href') || '';
          const linkText = $link.text().trim();

          // Server name links: /server-s123/ or similar
          if (href.includes('/server-s') || href.includes('/servers/')) {
            if (linkText.length > 2 && linkText.length < 50) {
              name = linkText;
            }
          }

          // IP patterns in links
          const ipMatch = linkText.match(/^([a-z0-9][-a-z0-9]*(?:\.[a-z0-9][-a-z0-9]*)*\.[a-z]{2,})(?::(\d+))?$/i);
          if (ipMatch) {
            ip = ipMatch[1];
          }
        });

        // If we didn't find IP in links, look in text content
        if (!ip) {
          const ipInText = text.match(/([a-z0-9][-a-z0-9]*\.[a-z]{2,}(?:\.[a-z]{2,})?)[:-]?(\d{2,5})?\b/i);
          if (ipInText && !ipInText[0].includes('.com/') && !ipInText[0].includes('.org/')) {
            // Filter out URLs that are part of the site itself
            const candidate = ipInText[1];
            if (!candidate.includes('minecraft-mp') && !candidate.includes('minecraft')) {
              ip = candidate;
            }
          }
        }

        // Version extraction
        const verMatch = text.match(/(\d+\.\d+(?:\.\d+)?)/);
        if (verMatch) version = verMatch[1];

        if (name && ip && !existingIPs.has(ip.toLowerCase())) {
          existingIPs.add(ip.toLowerCase());

          // Check if server has PvP-related tags in text
          const textLower = text.toLowerCase();
          const pvpTags = [];
          const tagMap = {
            'pvp': 'PvP', 'practice': 'Practice', 'kit': 'KitPvP',
            'duel': 'Duels', 'faction': 'Factions', 'hcf': 'HCF',
            'bedwar': 'Bedwars', 'skywar': 'Skywars', 'uhc': 'UHC',
            'prison': 'Prison', 'survival': 'Survival', 'skyblock': 'Skyblock',
            'minigam': 'Minigames', 'lifesteal': 'Lifesteal',
            'ff[af]': 'FFA', 'sumo': 'Sumo', 'anarch': 'Anarchy',
            'crystal': 'CrystalPvP',
          };

          for (const [pattern, tag] of Object.entries(tagMap)) {
            if (new RegExp(pattern).test(textLower)) {
              pvpTags.push(tag);
            }
          }

          // Only include if it has PvP relevance
          if (pvpTags.length > 0 && ['HCF','Factions','PvP','Practice','KitPvP','Duels','Bedwars','Skywars','UHC','Prison','Minigames','CrystalPvP','Lifesteal','Anarchy','FFA'].some(t => pvpTags.includes(t))) {
            servers.push({
              name: name.substring(0, 100),
              ip,
              port: 25565,
              version: version || '1.21',
              tags: [...new Set(pvpTags)].slice(0, 6),
              verified: false,
              vote_count: Math.floor(Math.random() * 200) + 10,
              description: `${name} - ${pvpTags.slice(0, 3).join(' / ')}.`,
            });
            found++;
          }
        }
      });

      console.log(`  → Found ${found} new servers on page ${page}`);

      if (found === 0 && page > 1) break;
      await delay(REQUEST_DELAY);
    }
  }

  return servers;
}

// ── Scrape minecraft-servers.gg ─────────────────────────
async function scrapeMinecraftServersGG(existingIPs) {
  console.log('\n🔍 Scraping minecraft-servers.gg (pvp-servers)...');
  const servers = [];

  const url = 'https://minecraft-servers.gg/pvp-servers';
  const html = await fetchHTML(url);

  if (!html) {
    console.log('  ✗ Failed to fetch');
    return servers;
  }

  if (html.includes('Cloudflare') || html.includes('cf-chl-')) {
    console.log('  ✗ Blocked by Cloudflare');
    return servers;
  }

  const $ = cheerio.load(html);

  // Try to extract server info from the page
  $('a').each((_, link) => {
    const $link = $(link);
    const href = $link.attr('href') || '';
    const text = $link.text().trim();

    // Look for server IP or hostname in href
    const ipMatch = href.match(/\/server\/([^/]+)/i);
    const ipInText = text.match(/([a-z0-9][-a-z0-9]*\.(?:net|org|com|gg|io|fun|host|me|xyz|cc|de|fr|eu|co|dev)(?::\d+)?)/i);

    let ip = '';
    let name = text.substring(0, 80);

    if (ipMatch) {
      // It's a server link, check for more info
      const serverId = ipMatch[1];
      // Try to find the actual IP in nearby text
    }

    if (ipInText && !ipInText[0].includes('minecraft-servers')) {
      ip = ipInText[1].split(':')[0];
    }

    if (name.length > 2 && ip && !existingIPs.has(ip.toLowerCase())) {
      existingIPs.add(ip.toLowerCase());
      servers.push({
        name,
        ip,
        port: 25565,
        version: '1.21',
        tags: ['PvP'],
        verified: false,
        vote_count: Math.floor(Math.random() * 100) + 5,
        description: `${name} - PvP server.`,
      });
    }
  });

  console.log(`  → Found ${servers.length} servers`);
  return servers;
}

// ── Scrape best-minecraft-servers.co ────────────────────
async function scrapeBestMCServers(existingIPs) {
  console.log('\n🔍 Scraping best-minecraft-servers.co...');
  const servers = [];

  const pvpCategories = ['pvp', 'minigames', 'factions', 'prison'];

  for (const cat of pvpCategories) {
    for (let page = 1; page <= 3; page++) {
      const url = `https://best-minecraft-servers.co/ourlist?search=&category=${cat}&order=players&sort=desc&page=${page - 1}`;
      console.log(`  ${cat} page ${page}`);

      const html = await fetchHTML(url);
      if (!html) break;

      if (html.includes('Cloudflare') || html.includes('cf-chl-') || html.includes('blocked')) {
        console.log('  ✗ Blocked by Cloudflare');
        break;
      }

      const $ = cheerio.load(html);
      let found = 0;

      // Look for server entries
      $('[class*="server"], [class*="server-card"]').each((_, el) => {
        const $el = $(el);
        const text = $el.text();
        const links = $el.find('a');

        let name = '';
        let ip = '';

        // Get name from heading/title
        const titleMatch = text.match(/^([^\n]{4,60})/);
        if (titleMatch) name = titleMatch[1].trim();

        // Find IP-like patterns
        links.each((_, link) => {
          const linkText = $(link).text().trim();
          const ipMatch = linkText.match(/([a-z0-9][-a-z0-9]*\.(?:net|org|com|gg|io|fun|host|me|xyz|cc|de|fr|eu|co)(?::\d+)?)/i);
          if (ipMatch && !linkText.includes('com/') && !linkText.includes('org/')) {
            ip = ipMatch[1].split(':')[0];
          }
        });

        if (!ip) {
          const allTextMatch = text.match(/([a-z0-9][-a-z0-9]*\.(?:net|org|com|gg|io|fun|host|me|xyz|cc|de|fr|eu|co)(?::\d+)?)/gi);
          if (allTextMatch) {
            for (const match of allTextMatch) {
              const clean = match.split(':')[0];
              if (!clean.includes('minecraft') && !clean.includes('best-minecraft')) {
                ip = clean;
                break;
              }
            }
          }
        }

        if (name.length > 2 && ip && !existingIPs.has(ip.toLowerCase())) {
          existingIPs.add(ip.toLowerCase());
          servers.push({
            name: name.substring(0, 100),
            ip,
            port: 25565,
            version: '1.21',
            tags: [cat.toUpperCase()],
            verified: false,
            vote_count: Math.floor(Math.random() * 150) + 10,
            description: `${name} - ${cat.toUpperCase()} server.`,
          });
          found++;
        }
      });

      console.log(`  → Found ${found} new servers`);
      if (found === 0 && page > 1) break;
      await delay(REQUEST_DELAY);
    }
  }

  return servers;
}

// ── Generate SQL ─────────────────────────────────────────
function generateSQL(servers) {
  const timestamp = new Date().toISOString().split('T')[0];
  const escaped = s => s.replace(/'/g, "''").replace(/\\/g, '\\\\');

  let sql = `-- ============================================================
-- Auto-generated seed file for pvpserverlist
-- Generated: ${timestamp}
-- Total servers: ${servers.length}
-- Source: scripts/scrape-servers.js
-- ============================================================
--
-- Usage: Execute on Supabase Postgres to populate the servers table
-- This inserts/updates servers based on IP uniqueness
--
-- ============================================================

\n`;

  // Generate VALUES clause in chunks of 50
  const chunks = [];
  let chunk = [];

  for (const s of servers) {
    const tags = s.tags.map(t => `'${escaped(t)}'`).join(', ');
    const name = escaped(s.name);
    const ip = escaped(s.ip);
    const desc = escaped(s.description || '');
    const ver = escaped(s.version);

    chunk.push(`(\n    '${name}', \n    '${ip}', \n    ${s.port}, \n    '${ver}', \n    ARRAY[${tags}]::text[], \n    ${s.verified}, \n    ${s.vote_count}, \n    '${desc}'\n  )`);

    if (chunk.length >= 50) {
      chunks.push(chunk.join(',\n  '));
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    chunks.push(chunk.join(',\n  '));
  }

  for (let i = 0; i < chunks.length; i++) {
    sql += `INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)\nVALUES\n  ${chunks[i]}\nON CONFLICT (ip) DO NOTHING;\n\n`;
  }

  return sql;
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  console.log('🚀 pvpserverlist scraper');
  console.log('══════════════════════════════');

  // Step 1: Load curated servers
  console.log('\n📋 Loading curated server list...');
  const curated = loadCuratedServers();
  console.log(`  → Loaded ${curated.length} curated servers`);

  // Deduplicate curated by IP
  const seen = new Map();
  for (const s of curated) {
    if (!seen.has(s.ip.toLowerCase())) {
      seen.set(s.ip.toLowerCase(), s);
    }
  }
  console.log(`  → ${seen.size} unique IPs after dedup`);

  // Step 2: Try scraping additional servers
  const existingIPs = new Set(seen.keys());
  const allServers = Array.from(seen.values());

  // Scrape minecraft-mp.com
  try {
    const mpServers = await scrapeMinecraftMP(existingIPs);
    for (const s of mpServers) allServers.push(s);
    console.log(`  → Total so far: ${allServers.length}`);
  } catch (e) {
    console.log(`  ✗ Scraping error: ${e.message}`);
  }

  // Scrape best-minecraft-servers.co
  try {
    const bestServers = await scrapeBestMCServers(existingIPs);
    for (const s of bestServers) allServers.push(s);
    console.log(`  → Total so far: ${allServers.length}`);
  } catch (e) {
    console.log(`  ✗ Scraping error: ${e.message}`);
  }

  // Scrape minecraft-servers.gg
  try {
    const ggServers = await scrapeMinecraftServersGG(existingIPs);
    for (const s of ggServers) allServers.push(s);
    console.log(`  → Total so far: ${allServers.length}`);
  } catch (e) {
    console.log(`  ✗ Scraping error: ${e.message}`);
  }

  // Deduplicate final list
  const finalSeen = new Map();
  for (const s of allServers) {
    if (!finalSeen.has(s.ip.toLowerCase())) {
      finalSeen.set(s.ip.toLowerCase(), s);
    }
  }
  const finalServers = Array.from(finalSeen.values());

  // Sort by vote count (descending)
  finalServers.sort((a, b) => b.vote_count - a.vote_count);

  // Step 3: Generate SQL
  console.log('\n💾 Generating SQL...');
  const sql = generateSQL(finalServers);
  fs.writeFileSync(OUTPUT_FILE, sql);

  console.log(`\n✅ Done! Wrote ${finalServers.length} servers to ${OUTPUT_FILE}`);
  console.log(`   File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);

  // Stats
  const tagCounts = {};
  for (const s of finalServers) {
    for (const t of s.tags) {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
  }
  console.log('\n📊 Tag distribution:');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      console.log(`  ${tag.padEnd(15)} ${count.toString().padStart(4)} servers`);
    });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
