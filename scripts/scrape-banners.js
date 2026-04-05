#!/usr/bin/env node
/**
 * Scrape server banners from minecraft.buzz
 * Each server card on minecraft.buzz/java/<page> has a NitroAd banner video+poster
 * that server owners buy for promotion. These are the banners the user wants.
 *
 * Also scrapes YouTube, Discord, website, and similar data.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVERS_JSON = path.join(__dirname, 'pvp-servers.json');
const OUTPUT_FILE = path.join(__dirname, 'server-banners.json');
const BASE_URL = 'https://crisps.minecraft.buzz/banners/';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchRaw(url, retries = 2) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      timeout: 15000,
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(res.statusCode < 400 ? data : null));
    }).on('error', () => {
      if (retries > 0) { delay(1000).then(() => resolve(fetchRaw(url, retries - 1))); }
      else resolve(null);
    });
  });
}

/**
 * Parse a minecraft.buzz listing page and extract server rows with their banners.
 * Each row has: server name, IP (from href to /server/<id>), banner poster, banner webm
 */
function parseBannersFromPage(html, pageUrl) {
  const results = [];

  // Each server card has:
  //   <a href="server/XXXX">... server name ...</a>
  //   <video ... poster="...poster.jpeg"> <source data-src="...webm"> </video>
  //   <h3>ServerName</h3>
  
  // Find all <video> blocks that have poster and data-src
  const videoRegex = /<video[^>]*poster="([^"]+)"[^>]*>[\s\S]*?<source[^>]*data-src="([^"]+)"[^>]*>[\s\S]*?<\/video>/g;
  const linkRegex = /<a\s+href="server\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;

  // Get all video banners in order
  const banners = [];
  let vm;
  while ((vm = videoRegex.exec(html)) !== null) {
    banners.push({ poster: vm[1], webm: vm[2] });
  }

  // Get all server links/names in order
  const servers = [];
  let lm;
  // Reset regex
  const linkRe = /<a\s+href="server\/(\d+)">[\s\S]*?<img\s+[^>]*alt="([^"]*)"[^>]*[\s\S]*?<\/a>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/g;
  while ((lm = linkRe.exec(html)) !== null) {
    servers.push({ id: lm[1], name: lm[3].trim(), alt: lm[2] });
  }

  // Match banners to servers (they should be in the same order in the page)
  const count = Math.max(banners.length, servers.length);
  for (let i = 0; i < count; i++) {
    const server = servers[i] || {};
    const banner = banners[i] || {};

    const posterClean = banner.poster ? banner.poster.replace('https://crisps.minecraft.buzz/banners/', '').replace('.jpeg', '') : null;
    const webmClean = banner.webm ? banner.webm.replace('https://crisps.minecraft.buzz/banners/', '').replace('.webm', '') : null;

    if (posterClean || server.id) {
      results.push({
        buzz_id: server.id || null,
        buzz_name: server.name || null,
        buzz_alt: server.alt || null,
        banner_poster: banner.poster || null,
        banner_webm: banner.webm || null,
        banner_hash: posterClean || webmClean || null,
      });
    }
  }

  return results;
}

async function main() {
  console.log('🎬 Scraping minecraft.buzz server banners\n');

  const allBanners = [];
  const seenHashes = new Set();

  // Crawl all the banner ad pages
  const pageUrls = [
    'https://minecraft.buzz/java',
    'https://minecraft.buzz/pvp',
    'https://minecraft.buzz/survival',
    'https://minecraft.buzz/hardcore',
    'https://minecraft.buzz/lifesteal',
    'https://minecraft.buzz/factions',
    'https://minecraft.buzz/minigames',
    'https://minecraft.buzz/prison',
    'https://minecraft.buzz/skyblock',
    'https://minecraft.buzz/hcf',
    'https://minecraft.buzz/pixelmon',
    'https://minecraft.buzz/creative',
    'https://minecraft.buzz/uhc',
    'https://minecraft.buzz/anarchy',
    'https://minecraft.buzz/duels',
  ];

  for (const pageUrl of pageUrls) {
    console.log(`  📄 ${pageUrl}`);
    const html = await fetchRaw(pageUrl);
    if (!html) { console.log('    ✗ Failed'); continue; }

    const banners = parseBannersFromPage(html, pageUrl);
    console.log(`    → ${banners.length} banners found`);

    for (const b of banners) {
      if (b.banner_hash && !seenHashes.has(b.banner_hash)) {
        seenHashes.add(b.banner_hash);
        b.page_url = pageUrl;
        allBanners.push(b);
      }
    }

    await delay(800);
  }

  console.log(`\n📊 Total unique banners: ${allBanners.length}`);

  // Now try to match banners to our servers by name
  const servers = JSON.parse(fs.readFileSync(SERVERS_JSON, 'utf-8'));
  const serversByName = new Map();
  for (const s of servers) {
    // Normalize name for matching
    const key = s.n.toLowerCase().replace(/[^a-z0-9]/g, '');
    serversByName.set(key, s);
    // Also try partial match
    serversByName.set(s.n.toLowerCase().replace(/\s+/g, '-'), s);
  }

  let matched = 0;
  const matches = [];
  for (const b of allBanners) {
    const name = (b.buzz_name || b.buzz_alt || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const server = serversByName.get(name);
    if (server) {
      matches.push({
        ip: server.i,
        name: server.n,
        buzz_id: b.buzz_id,
        buzz_name: b.buzz_name || b.buzz_alt,
        banner_poster: b.banner_poster,
        banner_webm: b.banner_webm,
        banner_hash: b.banner_hash,
        page_url: b.page_url,
      });
      matched++;
    }
  }

  console.log(`Matched to our servers: ${matched}/${allBanners.length}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    all_banners: allBanners,
    matched: matches,
  }, null, 2));

  console.log(`\n💾 Saved to ${OUTPUT_FILE}`);
  console.log(`  ${allBanners.length} unique banner ads scraped`);
  console.log(`  ${matched} matched to our server list`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
