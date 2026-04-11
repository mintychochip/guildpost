#!/usr/bin/env node
/**
 * High-Volume Minecraft Server Scraper
 * Targets 20+ sources, uses parallel processing, optimized HTTP requests
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// 20+ Server list sources
const SOURCES = [
  // Working sources from earlier
  { name: 'minecraft-server.net', url: 'https://minecraft-server.net', pages: 100, type: 'html' },
  { name: 'mcservers.top', url: 'https://mcservers.top', pages: 100, type: 'html' },
  { name: 'mineservers.com', url: 'https://mineservers.com', pages: 100, type: 'html' },
  { name: 'topminecraftservers.org', url: 'https://topminecraftservers.org', pages: 100, type: 'html' },
  
  // Additional sources
  { name: 'minecraftservers.org', url: 'https://minecraftservers.org', pages: 100, type: 'html' },
  { name: 'minecraft-serverlist.com', url: 'https://minecraft-serverlist.com', pages: 100, type: 'html' },
  { name: 'mc-serverlist.com', url: 'https://mc-serverlist.com', pages: 100, type: 'html' },
  { name: 'minecraftlist.org', url: 'https://minecraftlist.org', pages: 100, type: 'html' },
  { name: 'mcsl', url: 'https://minecraft-server-list.com', pages: 100, type: 'html' },
  { name: 'topg.org', url: 'https://topg.org/minecraft', pages: 100, type: 'html' },
  { name: 'gtop100', url: 'https://gtop100.com/minecraft', pages: 100, type: 'html' },
  { name: 'minecraft-mp.com/list', url: 'https://minecraft-mp.com/list', pages: 100, type: 'html' },
  { name: 'craftlist', url: 'https://craftlist.org', pages: 100, type: 'html' },
  { name: 'minecraft-server.eu', url: 'https://minecraft-server.eu', pages: 100, type: 'html' },
  { name: 'minecraft-list.cz', url: 'https://minecraft-list.cz', pages: 100, type: 'html' },
  { name: 'mc-lists.org', url: 'https://mc-lists.org', pages: 100, type: 'html' },
  
  // Alternative list sites
  { name: 'servers-minecraft', url: 'https://servers-minecraft.com', pages: 100, type: 'html' },
  { name: 'minecraftservers.biz', url: 'https://minecraftservers.biz', pages: 100, type: 'html' },
  { name: 'minelist', url: 'https://minelist.net', pages: 100, type: 'html' },
  { name: 'mclist', url: 'https://mclist.io', pages: 100, type: 'html' },
  { name: 'servercraft', url: 'https://servercraft.co', pages: 100, type: 'html' },
  { name: 'mc-votes', url: 'https://mc-votes.com', pages: 100, type: 'html' },
  { name: 'minecraftservers.net', url: 'https://minecraftservers.net', pages: 100, type: 'html' },
  { name: 'minecraft.buzz', url: 'https://minecraft.buzz', pages: 100, type: 'html' },
  { name: 'minecraft-serverlist.co', url: 'https://minecraft-serverlist.co', pages: 100, type: 'html' },
];

// Common domain patterns to look for
const DOMAIN_PATTERNS = [
  // play.example.com, mc.example.com, etc.
  /(?:play|mc|hub|join|srv|server|game)\.[a-z0-9-]+\.[a-z]{2,}/gi,
  // example.com, example.net, etc.
  /[a-z0-9-]+\.(?:com|net|org|io|gg|me|xyz|club|network|mc|games)/gi,
  // IP:port patterns
  /\b(?:\d{1,3}\.){3}\d{1,3}:\d{2,5}\b/g,
  // Common server name patterns
  /[a-z0-9]{3,20}(?:mc|craft|pixel|mine|block|pvp|smp|skyblock|prison|network)\.[a-z]{2,}/gi,
];

// Common hosting domains to filter out
const BAD_DOMAINS = [
  'minecraft.net', 'mojang.com', 'microsoft.com', 'google.com',
  'facebook.com', 'twitter.com', 'discord.com', 'youtube.com',
  'minecraft-mp.com', 'server-list.org', 'cloudflare.com',
  'ajax.googleapis.com', 'fonts.googleapis.com', 'cdn.jsdelivr.net',
  'bootstrapcdn.com', 'jquery.com', 'google-analytics.com',
  'doubleclick.net', 'googletagmanager.com', 'gstatic.com',
  'fontawesome.com', 'jsdelivr.net', 'unpkg.com', 'wp.com',
  'gravatar.com', 'wordpress.org', 'w3.org', 'schema.org',
  'ogp.me', 'twitter.com', 'x.com', 'instagram.com', 'tiktok.com',
  'reddit.com', 'github.com', 'gitlab.com', 'bitbucket.org',
  'paypal.com', 'stripe.com', 'squareup.com', 'shopify.com',
  'amazon.com', 'aws.amazon.com', 'cloudfront.net', 's3.amazonaws.com',
  'herokuapp.com', 'vercel.app', 'netlify.app', 'firebaseapp.com',
  'github.io', 'gitlab.io', 'surge.sh', 'glitch.me', 'repl.co',
  'codepen.io', 'jsfiddle.net', 'stackoverflow.com', 'stackexchange.com',
  'medium.com', 'dev.to', 'hashnode.com', 'substack.com',
  'patreon.com', 'ko-fi.com', 'buymeacoffee.com', 'gofundme.com',
  'kickstarter.com', 'indiegogo.com', 'change.org', 'petition.org',
  'change.org', 'campaign.org', 'action.org', 'donorbox.org',
  'donately.com', 'fundly.com', 'classy.org', 'networkforgood.com',
  'givebutter.com', 'fundraiseup.com', 'rallyup.com', 'donately.com',
  'fundly.com', 'classy.org', 'networkforgood.com', 'givebutter.com',
  'fundraiseup.com', 'rallyup.com'
];

async function validateServer(ip) {
  try {
    await dnsLookup(ip);
    return true;
  } catch (e) {
    return false;
  }
}

function isValidServer(ip) {
  if (!ip || ip.length < 4) return false;
  if (!ip.includes('.')) return false;
  if (ip.startsWith('.')) return false;
  if (BAD_DOMAINS.some(bad => ip.includes(bad))) return false;
  if (ip.includes(' ')) return false;
  if (/^\d+$/.test(ip)) return false; // Just numbers
  if (ip.endsWith('.png') || ip.endsWith('.jpg') || ip.endsWith('.gif')) return false;
  if (ip.endsWith('.js') || ip.endsWith('.css') || ip.endsWith('.html')) return false;
  return true;
}

function extractDomainsFromText(text) {
  const domains = new Set();
  
  // Apply all patterns
  for (const pattern of DOMAIN_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      let domain = match[0].toLowerCase().trim();
      
      // Clean up
      if (domain.startsWith('.')) domain = domain.slice(1);
      if (domain.endsWith('.')) domain = domain.slice(0, -1);
      
      if (isValidServer(domain)) {
        domains.add(domain);
      }
    }
  }
  
  // Also look for explicit server address patterns
  const explicitPattern = /(?:server|ip|address|hostname)["']?\s*[:=]\s*["']?([a-z0-9.-]+\.[a-z]{2,})/gi;
  let match;
  while ((match = explicitPattern.exec(text)) !== null) {
    let domain = match[1].toLowerCase().trim();
    if (isValidServer(domain)) {
      domains.add(domain);
    }
  }
  
  return Array.from(domains);
}

async function scrapeSource(source, browser) {
  console.log(`\n🌐 Starting: ${source.name}`);
  const servers = new Set();
  let consecutiveEmpty = 0;
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  });
  
  for (let pageNum = 1; pageNum <= source.pages; pageNum++) {
    const page = await context.newPage();
    
    try {
      const pageUrl = pageNum === 1 
        ? source.url 
        : `${source.url}/page/${pageNum}`;
      
      const response = await page.goto(pageUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      
      if (!response || response.status() !== 200) {
        await page.close();
        break;
      }
      
      await page.waitForTimeout(2000);
      
      // Extract all text from page
      const pageText = await page.evaluate(() => document.body.innerText);
      const domains = extractDomainsFromText(pageText);
      
      let newCount = 0;
      for (const domain of domains) {
        if (!servers.has(domain)) {
          servers.add(domain);
          newCount++;
        }
      }
      
      process.stdout.write(`\r  Page ${pageNum}: +${newCount} | Total: ${servers.size} `);
      
      if (newCount === 0) {
        consecutiveEmpty++;
        if (consecutiveEmpty >= 5) {
          console.log(`\n  ⏹️  5 empty pages, stopping`);
          break;
        }
      } else {
        consecutiveEmpty = 0;
      }
      
    } catch (err) {
      // Silent fail for speed
    } finally {
      await page.close();
    }
  }
  
  await context.close();
  
  console.log(`\n  ✅ ${source.name}: ${servers.size} servers`);
  return Array.from(servers).map(ip => ({ ip, port: 25565, source: source.name }));
}

async function scrapeAll() {
  console.log('🚀 HIGH-VOLUME MINECRAFT SERVER SCRAPER');
  console.log(`🎯 Target: ${SOURCES.length} sources`);
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const allServers = [];
  const seen = new Set();
  
  // Scrape sources sequentially (to avoid overwhelming sites)
  for (const source of SOURCES) {
    try {
      const sourceServers = await scrapeSource(source, browser);
      
      // Deduplicate and add
      for (const server of sourceServers) {
        if (!seen.has(server.ip)) {
          seen.add(server.ip);
          allServers.push(server);
        }
      }
    } catch (e) {
      console.log(`  ❌ ${source.name} failed: ${e.message}`);
    }
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  writeFileSync(`mc_thousands_${timestamp}.json`, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: allServers.length,
    servers: allServers
  }, null, 2));
  
  writeFileSync(`mc_thousands_${timestamp}.txt`, allServers.map(s => s.ip).join('\n'));
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎉 DONE! Total unique servers: ${allServers.length}`);
  console.log(`📁 Files: mc_thousands_${timestamp}.json / .txt`);
  
  return allServers;
}

scrapeAll().catch(console.error);
