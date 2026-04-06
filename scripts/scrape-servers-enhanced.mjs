#!/usr/bin/env node
// Enhanced MC Server Scraper - Saves to JSON file
// Scrapes 1000+ servers from multiple listing sites

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Scraper configurations for each site
const SCRAPERS = [
  {
    name: 'minecraftservers.org',
    url: 'https://minecraftservers.org',
    listSelector: '.server-list .server-item, .server-listing .server, .servers .server',
    fields: {
      name: '.server-name, .name, h3, h4',
      ip: '.server-ip, .ip, .address',
      port: '.server-port, .port',
      description: '.server-description, .description, p',
      tags: '.server-tags span, .tags span, .gamemodes span',
      players: '.server-players, .players, .player-count'
    }
  },
  {
    name: 'minecraft-serverlist.co',
    url: 'https://minecraft-serverlist.co',
    listSelector: '.server-item, .server-card, .listing-item',
    fields: {
      name: '.name, .server-name, h3',
      ip: '.ip, .address, .server-ip',
      description: '.description',
      tags: '.tags span, .gamemode span',
      players: '.players'
    }
  },
  {
    name: 'minecraft.buzz',
    url: 'https://minecraft.buzz',
    listSelector: '.server-card, .server-item, .server',
    fields: {
      name: '.server-title, .name, h3',
      ip: '.server-address, .address, .ip',
      description: '.server-desc, .description',
      tags: '.gamemodes span, .tags span',
      players: '.player-count, .players'
    }
  },
  {
    name: 'minecraft-mp.com',
    url: 'https://minecraft-mp.com',
    listSelector: '.server-item, .server-listing .item, .servers .server',
    fields: {
      name: '.server-name, .name, h3',
      ip: '.server-address, .address',
      description: '.description',
      tags: '.tags span',
      players: '.players'
    }
  },
  {
    name: 'topg.org',
    url: 'https://topg.org/minecraft-servers',
    listSelector: '.server-item, .listing-item, .server',
    fields: {
      name: '.server-name, .name, h3',
      ip: '.server-ip, .ip, .address',
      description: '.description',
      tags: '.tags span',
      players: '.players'
    }
  },
  {
    name: 'minecraft-server-list.com',
    url: 'https://minecraft-server-list.com',
    listSelector: '.server-item, .server-card, .listing .item',
    fields: {
      name: '.server-name, .name, h3',
      ip: '.server-ip, .ip',
      description: '.description',
      tags: '.tags span, .gamemodes span',
      players: '.players, .player-count'
    }
  },
  {
    name: 'minecraft-server.net',
    url: 'https://minecraft-server.net',
    listSelector: '.server-item, .server-listing .server',
    fields: {
      name: '.server-name, .name, h3',
      ip: '.ip, .address',
      description: '.description',
      tags: '.tags span',
      players: '.players'
    }
  }
];

async function scrapeSite(scraper, browser) {
  console.log(`\n🌐 Scraping ${scraper.name}...`);
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const servers = [];
  
  try {
    await page.goto(scraper.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Handle pagination - up to 50 pages per site
    let hasNextPage = true;
    let pageNum = 1;
    const maxPages = 50;
    
    while (hasNextPage && pageNum <= maxPages) {
      console.log(`  📄 Page ${pageNum}`);
      
      // Wait for server list to load
      try {
        await page.waitForSelector(scraper.listSelector, { timeout: 5000 });
      } catch (e) {
        console.log(`  ⚠️  No servers found on page ${pageNum}`);
        break;
      }
      
      // Extract servers from current page
      const pageServers = await page.evaluate((selector, fields) => {
        const items = document.querySelectorAll(selector);
        return Array.from(items).map(item => {
          const getText = (sel) => {
            const selectors = sel.split(', ');
            for (const s of selectors) {
              const el = item.querySelector(s);
              if (el) return el.textContent?.trim() || '';
            }
            return '';
          };
          
          const getAllText = (sel) => {
            const selectors = sel.split(', ');
            for (const s of selectors) {
              const els = item.querySelectorAll(s);
              if (els.length > 0) return Array.from(els).map(el => el.textContent.trim());
            }
            return [];
          };
          
          const playersText = getText(fields.players);
          const playersMatch = playersText.match(/(\d+)\s*\/\s*(\d+)/);
          
          return {
            name: getText(fields.name),
            ip: getText(fields.ip),
            port: parseInt(getText(fields.port)) || 25565,
            description: getText(fields.description),
            tags: getAllText(fields.tags),
            players_online: playersMatch ? parseInt(playersMatch[1]) : 0,
            max_players: playersMatch ? parseInt(playersMatch[2]) : 0,
            source: scraper.name
          };
        }).filter(s => s.name && s.ip); // Only keep servers with name and IP
      }, scraper.listSelector, scraper.fields);
      
      servers.push(...pageServers);
      console.log(`  ✅ Found ${pageServers.length} servers (total: ${servers.length})`);
      
      // Check for next page
      const nextSelectors = ['a.next', '.pagination .next', '[rel="next"]', '.next-page', 'a:has-text("Next")', 'a:has-text("»")'];
      let nextBtn = null;
      
      for (const sel of nextSelectors) {
        nextBtn = await page.$(sel);
        if (nextBtn) break;
      }
      
      if (nextBtn) {
        const isDisabled = await nextBtn.evaluate(el => el.disabled || el.classList.contains('disabled'));
        if (!isDisabled) {
          await nextBtn.click();
          await page.waitForTimeout(3000);
          pageNum++;
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }
    
  } catch (err) {
    console.error(`  ❌ Error scraping ${scraper.name}:`, err.message);
  } finally {
    await context.close();
  }
  
  return servers;
}

async function main() {
  console.log('🚀 Starting Enhanced MC Server Scraper');
  console.log('🎯 Target: 1000+ servers\n');
  
  const browser = await chromium.launch({ headless: true });
  const allServers = [];
  
  for (const scraper of SCRAPERS) {
    const servers = await scrapeSite(scraper, browser);
    allServers.push(...servers);
    console.log(`  📈 Running total: ${allServers.length} servers`);
  }
  
  await browser.close();
  
  // Deduplicate by IP
  const unique = new Map();
  for (const server of allServers) {
    if (server.ip && !unique.has(server.ip)) {
      unique.set(server.ip, server);
    }
  }
  
  const deduped = Array.from(unique.values());
  console.log(`\n📊 ${allServers.length} total, ${deduped.length} unique after deduplication`);
  
  // Save to JSON file
  const outputFile = join(__dirname, '..', `mc_servers_scraped_${Date.now()}.json`);
  writeFileSync(outputFile, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: deduped.length,
    servers: deduped
  }, null, 2));
  
  console.log(`\n💾 Saved to: ${outputFile}`);
  
  // Also save simple text list
  const textFile = join(__dirname, '..', `mc_servers_scraped_${Date.now()}.txt`);
  const textList = deduped.map(s => `${s.ip}:${s.port}`).join('\n');
  writeFileSync(textFile, textList);
  console.log(`💾 Text list saved to: ${textFile}`);
  
  console.log(`\n🎉 DONE! Scraped ${deduped.length} unique servers`);
  console.log('\n📋 Sample servers:');
  deduped.slice(0, 10).forEach(s => {
    console.log(`  - ${s.name} (${s.ip}:${s.port})`);
  });
  if (deduped.length > 10) {
    console.log(`  ... and ${deduped.length - 10} more`);
  }
}

main().catch(err => {
  console.error('💥 Scraper failed:', err);
  process.exit(1);
});
