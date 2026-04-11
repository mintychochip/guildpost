#!/usr/bin/env node
/**
 * Mass scraper - simplified for speed
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

// Quick sources that worked before
const SOURCES = [
  { name: 'minecraft-server.net', url: 'https://minecraft-server.net', pages: 200 },
  { name: 'mcservers.top', url: 'https://mcservers.top', pages: 200 },
  { name: 'mineservers.com', url: 'https://mineservers.com', pages: 200 },
  { name: 'topminecraftservers.org', url: 'https://topminecraftservers.org', pages: 200 },
  { name: 'minecraftservers.org', url: 'https://minecraftservers.org', pages: 200 },
  { name: 'minecraft-serverlist.com', url: 'https://minecraft-serverlist.com', pages: 200 },
  { name: 'minecraftlist.org', url: 'https://minecraftlist.org', pages: 200 },
  { name: 'craftlist.org', url: 'https://craftlist.org', pages: 200 },
];

const DOMAIN_PATTERN = /[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|gg|me|xyz|club)/gi;
const BAD = ['minecraft', 'google', 'facebook', 'twitter', 'youtube', 'discord', 'cloudflare', 'paypal'];

async function scrape() {
  console.log('🚀 MASS SCRAPER - Thousands of servers');
  
  const browser = await chromium.launch({ headless: true });
  const allServers = new Set();
  
  for (const source of SOURCES) {
    console.log(`\n📡 ${source.name}`);
    const context = await browser.newContext();
    
    for (let p = 1; p <= source.pages; p++) {
      const page = await context.newPage();
      try {
        const url = p === 1 ? source.url : `${source.url}/page/${p}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(1500);
        
        const text = await page.evaluate(() => document.body.innerText);
        const matches = text.matchAll(DOMAIN_PATTERN);
        
        let newCount = 0;
        for (const m of matches) {
          const ip = m[0].toLowerCase();
          if (!BAD.some(b => ip.includes(b)) && ip.length > 4) {
            if (!allServers.has(ip)) {
              allServers.add(ip);
              newCount++;
            }
          }
        }
        
        process.stdout.write(`\r  Page ${p}: +${newCount} | Total: ${allServers.size}`);
        
        if (newCount === 0 && p > 5) break;
        
      } catch (e) {}
      await page.close();
    }
    
    await context.close();
  }
  
  await browser.close();
  
  const servers = Array.from(allServers).map(ip => ({ ip, port: 25565 }));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  writeFileSync(`mass_scrape_${timestamp}.json`, JSON.stringify({
    total: servers.length,
    servers
  }, null, 2));
  
  writeFileSync(`mass_scrape_${timestamp}.txt`, servers.map(s => s.ip).join('\n'));
  
  console.log(`\n\n🎉 DONE! ${servers.length} servers`);
}

scrape().catch(console.error);
