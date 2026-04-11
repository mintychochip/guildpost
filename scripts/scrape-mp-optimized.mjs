#!/usr/bin/env node
/**
 * Optimized minecraft-mp.com scraper
 * Uses text pattern matching on rendered page content
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const COUNTRIES = [
  'United States of America', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia',
  'Brazil', 'Turkey', 'Romania', 'Philippines', 'Indonesia', 'India', 'Poland', 'Netherlands',
  'Singapore', 'Italy', 'Spain', 'Malaysia', 'Thailand', 'Vietnam', 'Japan', 'Korea', 'Russia',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium', 'Switzerland', 'Austria', 'Czech',
  'Hungary', 'Portugal', 'Greece', 'Ukraine', 'Argentina', 'Chile', 'Mexico', 'Colombia',
  'Peru', 'Ecuador', 'South Africa', 'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'New Zealand',
  'Europe', 'Asia', 'North America', 'South America', 'Oceania', 'Africa', 'World', 'Unknown'
];

async function scrapeMinecraftMP() {
  console.log('🚀 Scraping minecraft-mp.com with optimized patterns');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const allServers = [];
  const seen = new Set();
  
  for (let pageNum = 1; pageNum <= 100; pageNum++) {
    const page = await context.newPage();
    
    try {
      process.stdout.write(`\r📄 Page ${pageNum}... `);
      
      const url = pageNum === 1 
        ? 'https://minecraft-mp.com/'
        : `https://minecraft-mp.com/servers/${pageNum}/`;
      
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      if (!response || response.status() !== 200) {
        process.stdout.write(`HTTP ${response?.status()} `);
        break;
      }
      
      // Wait for content
      await page.waitForTimeout(3000);
      
      // Extract using page evaluation - look for domain patterns
      const pageServers = await page.evaluate((countries) => {
        const servers = [];
        const seen = new Set();
        
        // Get all text content
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n');
        
        // Build country pattern regex
        const countryPattern = new RegExp(
          '(' + countries.join('|') + ')\\s+([a-zA-Z0-9][a-zA-Z0-9.-]*\\.[a-zA-Z0-9-]+\\.[a-zA-Z]{2,})',
          'gi'
        );
        
        // Search in the whole text
        let match;
        while ((match = countryPattern.exec(bodyText)) !== null) {
          const ip = match[2].toLowerCase();
          if (!seen.has(ip) && ip.length > 3 && ip.includes('.')) {
            seen.add(ip);
            servers.push({ ip, port: 25565 });
          }
        }
        
        return servers;
      }, COUNTRIES);
      
      let newCount = 0;
      for (const server of pageServers) {
        const key = `${server.ip}:${server.port}`;
        if (!seen.has(key)) {
          seen.add(key);
          allServers.push({
            ...server,
            page: pageNum,
            source: 'minecraft-mp.com'
          });
          newCount++;
        }
      }
      
      process.stdout.write(`+${newCount} new | Total: ${allServers.length} `);
      
      if (newCount === 0 && pageNum > 3) {
        console.log('\n\n⏹️  No new servers, stopping');
        break;
      }
      
    } catch (err) {
      process.stdout.write(`⚠️  ${err.message.substring(0, 30)} `);
      if (pageNum > 3) break;
    } finally {
      await page.close();
    }
    
    await new Promise(r => setTimeout(r, 1500));
  }
  
  await browser.close();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  writeFileSync(`mc_mp_optimized_${timestamp}.json`, JSON.stringify({
    scraped_at: new Date().toISOString(),
    total: allServers.length,
    source: 'minecraft-mp.com',
    servers: allServers
  }, null, 2));
  
  const addresses = allServers.map(s => s.ip).join('\n');
  writeFileSync(`mc_mp_optimized_${timestamp}.txt`, addresses);
  
  console.log(`\n\n✅ DONE! Found ${allServers.length} unique servers`);
  console.log(`📁 JSON: mc_mp_optimized_${timestamp}.json`);
  console.log(`📁 TXT: mc_mp_optimized_${timestamp}.txt`);
  
  return allServers;
}

scrapeMinecraftMP().catch(console.error);
