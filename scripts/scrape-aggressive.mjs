#!/usr/bin/env node
/**
 * Aggressive high-volume scraper
 * More patterns, more sources, faster extraction
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import https from 'https';

// 30+ sources
const SOURCES = [
  // Direct list pages that likely work
  { url: 'https://minecraft-server.net', pages: 500, name: 'minecraft-server.net' },
  { url: 'https://mcservers.top', pages: 500, name: 'mcservers.top' },
  { url: 'https://mineservers.com', pages: 500, name: 'mineservers.com' },
  { url: 'https://topminecraftservers.org', pages: 500, name: 'topminecraftservers.org' },
  
  // Additional lists
  { url: 'https://minecraftservers.org', pages: 300, name: 'minecraftservers.org' },
  { url: 'https://minecraft-serverlist.com', pages: 300, name: 'minecraft-serverlist.com' },
  { url: 'https://mc-serverlist.com', pages: 300, name: 'mc-serverlist.com' },
  { url: 'https://minecraftlist.org', pages: 300, name: 'minecraftlist.org' },
  { url: 'https://minecraft-server-list.com', pages: 300, name: 'mcsl' },
  { url: 'https://topg.org/minecraft', pages: 300, name: 'topg.org' },
  { url: 'https://gtop100.com/minecraft', pages: 300, name: 'gtop100' },
  { url: 'https://craftlist.org', pages: 300, name: 'craftlist' },
  { url: 'https://minecraft-server.eu', pages: 300, name: 'minecraft-server.eu' },
  { url: 'https://minecraft-list.cz', pages: 300, name: 'minecraft-list.cz' },
  { url: 'https://mc-lists.org', pages: 300, name: 'mc-lists.org' },
  { url: 'https://servers-minecraft.com', pages: 300, name: 'servers-minecraft' },
  { url: 'https://minecraftservers.biz', pages: 300, name: 'minecraftservers.biz' },
  { url: 'https://minelist.net', pages: 300, name: 'minelist' },
  { url: 'https://mclist.io', pages: 300, name: 'mclist' },
  { url: 'https://servercraft.co', pages: 300, name: 'servercraft' },
  { url: 'https://mc-votes.com', pages: 300, name: 'mc-votes' },
  { url: 'https://minecraftservers.net', pages: 300, name: 'minecraftservers.net' },
  { url: 'https://minecraft.buzz', pages: 300, name: 'minecraft.buzz' },
  { url: 'https://minecraft-serverlist.co', pages: 300, name: 'minecraft-serverlist.co' },
  { url: 'https://mcservertime.com', pages: 300, name: 'mcservertime' },
  { url: 'https://mc-serv.com', pages: 300, name: 'mc-serv' },
  { url: 'https://minecraftserverlist.com', pages: 300, name: 'minecraftserverlist' },
  { url: 'https://minecraftservers100.com', pages: 300, name: 'minecraftservers100' },
  { url: 'https://best-minecraft-servers.com', pages: 300, name: 'best-minecraft-servers' },
  { url: 'https://minecraft-servers.com', pages: 300, name: 'minecraft-servers' },
  { url: 'https://mcserverstatus.com', pages: 300, name: 'mcserverstatus' },
];

// More comprehensive patterns
const PATTERNS = [
  // play.server.com, mc.server.com, etc
  /(?:play|mc|hub|join|srv|server|game|network|pvp|skyblock|faction|smp|prison|creative|survival|minigames)\.[a-z0-9-]{2,50}\.[a-z]{2,10}/gi,
  // server.com variations
  /[a-z0-9-]{3,50}(?:mc|craft|pixel|mine|block|pvp|smp|skyblock|prison|network|gaming|server)\.[a-z]{2,10}/gi,
  // Common hosting domains
  /[a-z0-9-]+\.(?:aternos|minehut|exaroton|server|mcprohosting|shockbyte)\.[a-z]{2,10}/gi,
  // IP:port format
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}\b/g,
  // Generic domain patterns that look like servers
  /[a-z0-9][a-z0-9-]{2,30}\.(?:com|net|org|io|gg|me|xyz|club|network|mc|games|online|fun)/gi,
];

const BAD_PATTERNS = [
  'minecraft.net', 'mojang.com', 'microsoft.com', 'google.com', 'facebook.com',
  'twitter.com', 'discord.com', 'youtube.com', 'instagram.com', 'tiktok.com',
  'reddit.com', 'github.com', 'gitlab.com', 'cloudflare.com', 'jquery.com',
  'bootstrap', 'fontawesome', 'googleapis', 'gstatic', 'wp.com', 'gravatar',
  'wordpress', 'cloudfront', 'amazon', 'aws', 'heroku', 'vercel', 'netlify',
  'firebase', 'github.io', 'youtube', 'youtu.be', 'paypal', 'stripe', 'shopify',
  'wikipedia', 'wikimedia', 'stackoverflow', 'stackexchange', 'medium.com',
  'patreon', 'ko-fi', 'buymeacoffee', 'gofundme', 'change.org',
  'doubleclick', 'googletagmanager', 'google-analytics', 'schema.org',
  'w3.org', 'ogp.me', 'fbcdn', 'twimg',
  '.png', '.jpg', '.jpeg', '.gif', '.css', '.js', '.html', '.svg', '.ico',
  'ajax', 'cdn', 'api', 'www', 'mail', 'blog', 'shop', 'store', 'app'
];

function isValid(ip) {
  if (!ip || ip.length < 5) return false;
  if (ip.length > 100) return false;
  if (!ip.includes('.')) return false;
  if (ip.startsWith('.') || ip.endsWith('.')) return false;
  if (ip.includes(' ')) return false;
  if (/^\d+\.\d+$/.test(ip)) return false; // Looks like version number
  if (BAD_PATTERNS.some(bad => ip.toLowerCase().includes(bad))) return false;
  return true;
}

function extractFromText(text) {
  const domains = new Set();
  
  for (const pattern of PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      let domain = match[0].toLowerCase().trim();
      // Clean up
      domain = domain.replace(/^[.:]+/, '').replace(/[.:]+$/, '');
      if (isValid(domain)) {
        domains.add(domain);
      }
    }
  }
  
  return Array.from(domains);
}

async function scrapeSource(source, browser) {
  const servers = new Set();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0.36',
    viewport: { width: 1920, height: 1080 }
  });
  
  console.log(`\n🌐 ${source.name} (${source.pages} pages max)`);
  let emptyCount = 0;
  
  for (let p = 1; p <= source.pages; p++) {
    const page = await context.newPage();
    try {
      const url = p === 1 ? source.url : `${source.url}/page/${p}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await page.waitForTimeout(1000);
      
      const text = await page.evaluate(() => document.body?.innerText || '');
      const found = extractFromText(text);
      
      let newCount = 0;
      for (const ip of found) {
        if (!servers.has(ip)) {
          servers.add(ip);
          newCount++;
        }
      }
      
      process.stdout.write(`\r  Page ${p}: +${newCount} | Source: ${servers.size} | Total unique: ${globalTotal.size}`);
      
      for (const ip of found) globalTotal.add(ip);
      
      if (newCount === 0) {
        emptyCount++;
        if (emptyCount >= 5) break;
      } else {
        emptyCount = 0;
      }
      
    } catch (e) {
      // Skip errors
    }
    await page.close();
  }
  
  await context.close();
  
  console.log(`\n  ✅ ${source.name}: ${servers.size} servers`);
  return Array.from(servers).map(ip => ({ ip, port: 25565, source: source.name }));
}

const globalTotal = new Set();

async function main() {
  console.log('=' .repeat(70));
  console.log('🔥 AGGRESSIVE MASS SCRAPER');
  console.log(`🎯 ${SOURCES.length} sources, thousands of pages`);
  console.log('=' .repeat(70));
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  
  const allServers = [];
  
  for (const source of SOURCES) {
    try {
      const s = await scrapeSource(source, browser);
      allServers.push(...s);
    } catch (e) {
      console.log(`\n  ❌ ${source.name}: ${e.message}`);
    }
  }
  
  await browser.close();
  
  // Save
  const uniqueServers = Array.from(globalTotal).map(ip => ({ ip, port: 25565 }));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  writeFileSync(`aggressive_${timestamp}.json`, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: uniqueServers.length,
    servers: uniqueServers
  }, null, 2));
  
  writeFileSync(`aggressive_${timestamp}.txt`, uniqueServers.map(s => s.ip).join('\n'));
  
  console.log('\n' + '=' .repeat(70));
  console.log(`🎉 TOTAL SERVERS: ${uniqueServers.length}`);
  console.log(`📁 Files: aggressive_${timestamp}.json / .txt`);
  console.log('=' .repeat(70));
}

main().catch(console.error);
