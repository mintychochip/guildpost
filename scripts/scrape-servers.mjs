// Multi-Site Minecraft Server Scraper
// Scrapes servers from multiple listing sites and inserts into Supabase

import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.qWj0l_7V1jO2k_I6V-0-lYlX2X-3-4-5-6-7-8-9-0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Scraper configurations for each site
const SCRAPERS = [
  {
    name: 'minecraftservers.org',
    url: 'https://minecraftservers.org',
    listSelector: '.server-list .server-item',
    fields: {
      name: '.server-name',
      ip: '.server-ip',
      port: '.server-port',
      description: '.server-description',
      tags: '.server-tags span',
      players: '.server-players',
      version: '.server-version'
    }
  },
  {
    name: 'minecraft-serverlist.co',
    url: 'https://minecraft-serverlist.co',
    listSelector: '.server-item',
    fields: {
      name: '.name',
      ip: '.ip',
      description: '.description',
      tags: '.tags span',
      players: '.players'
    }
  },
  {
    name: 'minecraft.buzz',
    url: 'https://minecraft.buzz',
    listSelector: '.server-card',
    fields: {
      name: '.server-title',
      ip: '.server-address',
      description: '.server-desc',
      tags: '.gamemodes span',
      players: '.player-count'
    }
  }
];

async function scrapeSite(scraper) {
  console.log(`\n🌐 Scraping ${scraper.name}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const servers = [];
  
  try {
    await page.goto(scraper.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Handle pagination if exists
    let hasNextPage = true;
    let pageNum = 1;
    
    while (hasNextPage && pageNum <= 10) { // Limit to 10 pages per site
      console.log(`  📄 Page ${pageNum}`);
      
      // Extract servers from current page
      const pageServers = await page.evaluate((selector, fields) => {
        const items = document.querySelectorAll(selector);
        return Array.from(items).map(item => {
          const getText = (sel) => item.querySelector(sel)?.textContent?.trim() || '';
          const getAllText = (sel) => Array.from(item.querySelectorAll(sel)).map(el => el.textContent.trim());
          
          return {
            name: getText(fields.name),
            ip: getText(fields.ip),
            port: parseInt(getText(fields.port)) || 25565,
            description: getText(fields.description),
            tags: getAllText(fields.tags),
            players_online: parseInt(getText(fields.players).split('/')[0]) || 0,
            max_players: parseInt(getText(fields.players).split('/')[1]) || 0,
            version: getText(fields.version)
          };
        });
      }, scraper.listSelector, scraper.fields);
      
      servers.push(...pageServers);
      console.log(`  ✅ Found ${pageServers.length} servers`);
      
      // Check for next page
      const nextBtn = await page.$('a.next, .pagination .next, [rel="next"]');
      if (nextBtn) {
        await nextBtn.click();
        await page.waitForTimeout(2000);
        pageNum++;
      } else {
        hasNextPage = false;
      }
    }
    
  } catch (err) {
    console.error(`  ❌ Error scraping ${scraper.name}:`, err.message);
  } finally {
    await browser.close();
  }
  
  return servers;
}

async function deduplicateAndInsert(servers) {
  console.log(`\n🔄 Processing ${servers.length} total servers...`);
  
  // Deduplicate by IP
  const unique = new Map();
  for (const server of servers) {
    if (server.ip && !unique.has(server.ip)) {
      unique.set(server.ip, server);
    }
  }
  
  const deduped = Array.from(unique.values());
  console.log(`  📊 ${deduped.length} unique servers after deduplication`);
  
  // Insert in batches
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < deduped.length; i += batchSize) {
    const batch = deduped.slice(i, i + batchSize).map(s => ({
      id: Math.random().toString(36).substring(2, 15),
      ip: s.ip,
      port: s.port || 25565,
      name: s.name || 'Unnamed Server',
      description: s.description || '',
      version: s.version || '',
      tags: s.tags || [],
      edition: 'java',
      verified: false,
      vote_count: 0,
      players_online: s.players_online || 0,
      max_players: s.max_players || 0,
      status: 'unknown',
      created_at: new Date().toISOString()
    }));
    
    const { error } = await supabase.from('servers').insert(batch);
    if (error) {
      console.error(`  ❌ Batch ${i/batchSize + 1} error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  ✅ Inserted batch ${i/batchSize + 1} (${batch.length} servers)`);
    }
  }
  
  return inserted;
}

async function main() {
  console.log('🚀 Starting Multi-Site Minecraft Server Scraper\n');
  
  const allServers = [];
  
  for (const scraper of SCRAPERS) {
    const servers = await scrapeSite(scraper);
    allServers.push(...servers);
    console.log(`  📈 Total so far: ${allServers.length} servers`);
  }
  
  if (allServers.length > 0) {
    const inserted = await deduplicateAndInsert(allServers);
    console.log(`\n🎉 DONE! Inserted ${inserted} servers into database`);
  } else {
    console.log('\n⚠️ No servers found. Sites may have changed their structure.');
  }
}

main().catch(console.error);
