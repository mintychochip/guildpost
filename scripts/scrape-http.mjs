#!/usr/bin/env node
/**
 * Fast HTTP-based scraper for non-JS sites
 * Uses node-fetch for speed
 */

import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// Fast HTTP sources (no JS required)
const HTTP_SOURCES = [
  'https://minecraft-server.net/page/',
  'https://mcservers.top/page/',
  'https://mineservers.com/page/',
  'https://topminecraftservers.org/page/',
  'https://minecraftservers.org/page/',
  'https://minecraftlist.org/page/',
  'https://craftlist.org/page/',
  'https://minecraft-server.eu/page/',
  'https://minecraft-list.cz/page/',
  'https://mc-lists.org/page/',
];

const DOMAIN_PATTERNS = [
  /(?:play|mc|hub|join|srv|server|game)\.[a-z0-9-]+\.[a-z]{2,}/gi,
  /[a-z0-9-]+\.(?:com|net|org|io|gg|me|xyz|club|network|mc)/gi,
  /\b(?:\d{1,3}\.){3}\d{1,3}:\d{2,5}\b/g,
];

const BAD_DOMAINS = ['minecraft.net', 'mojang.com', 'google.com', 'facebook.com', 
  'twitter.com', 'discord.com', 'youtube.com', 'minecraft-mp.com'];

function isValid(ip) {
  if (!ip || ip.length < 4) return false;
  if (!ip.includes('.')) return false;
  if (BAD_DOMAINS.some(bad => ip.includes(bad))) return false;
  if (ip.includes(' ')) return false;
  return true;
}

function extractDomains(text) {
  const domains = new Set();
  for (const pattern of DOMAIN_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      let domain = match[0].toLowerCase();
      if (isValid(domain)) domains.add(domain);
    }
  }
  return Array.from(domains);
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    return null;
  }
}

async function scrapeSource(baseUrl, maxPages = 100) {
  const servers = new Set();
  
  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? baseUrl : `${baseUrl}${page}`;
    const html = await fetchPage(url);
    if (!html) break;
    
    const domains = extractDomains(html);
    let newCount = 0;
    for (const d of domains) {
      if (!servers.has(d)) {
        servers.add(d);
        newCount++;
      }
    }
    
    process.stdout.write(`\r  ${baseUrl}: Page ${page}, +${newCount} | Total: ${servers.size} `);
    
    if (newCount === 0 && page > 3) break;
    
    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log();
  return Array.from(servers).map(ip => ({ ip, port: 25565, source: baseUrl }));
}

async function main() {
  console.log('🚀 Fast HTTP Scraper');
  console.log(`🎯 ${HTTP_SOURCES.length} sources\n`);
  
  const allServers = [];
  const seen = new Set();
  
  for (const source of HTTP_SOURCES) {
    try {
      const servers = await scrapeSource(source, 50);
      for (const s of servers) {
        if (!seen.has(s.ip)) {
          seen.add(s.ip);
          allServers.push(s);
        }
      }
    } catch (e) {
      console.log(`  ❌ ${source}: ${e.message}`);
    }
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  writeFileSync(`mc_http_${timestamp}.json`, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: allServers.length,
    servers: allServers
  }, null, 2));
  
  writeFileSync(`mc_http_${timestamp}.txt`, allServers.map(s => s.ip).join('\n'));
  
  console.log(`\n✅ DONE! ${allServers.length} servers`);
}

main().catch(console.error);
