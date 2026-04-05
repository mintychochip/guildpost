#!/usr/bin/env node
/**
 * Scrape real video banners from minecraft-mp.com listing pages.
 * The listing pages have both the video banner URL AND the server IP in the same <tr>.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';
const BUCKET = 'banners';
const MP = 'https://minecraft-mp.com';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchHTML(url, retries = 2) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36' }, timeout: 15000 }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => res.statusCode >= 400 ? (retries > 0 ? delay(1000).then(() => resolve(fetchHTML(url, retries-1))) : resolve(null)) : resolve(d));
    }).on('error', () => retries > 0 ? delay(1000).then(() => resolve(fetchHTML(url, retries-1))) : resolve(null));
  });
}

/**
 * Parse listing page <tr> rows. Each row has:
 * - <a> links (first one has favicon, second might be the server name)
 * - <video> with the banner URL
 * - The server IP appears in the row text
 */
function parseRow(html) {
  const rows = [];
  const trRegex = /<tr>([\s\S]*?)<\/tr>/gi;
  let m;
  
  while ((m = trRegex.exec(html)) !== null) {
    const row = m[1];
    
    // Look for video banner
    const videoMatch = row.match(/banner-(\d+)-(\d+)\.mp4"[^>]*title="([^"]+)"/i);
    if (!videoMatch) continue;
    
    const serverId = videoMatch[1];
    const ts = videoMatch[2];
    const videoUrl = `https://minecraft-mp.com/images/banners/banner-${serverId}-${ts}.mp4`;
    const name = videoMatch[3];
    
    // Extract IP: look for link to /server-sXXXX - the IP might be nearby
    // In minecraft-mp listing, the server IP is often in <a href="/server-sXXX">IP or Name</a>
    // Or there's a server link with the IP
    // Try to find IP-like text in the row
    const ipCandidates = row.match(/([a-z0-9][-a-z0-9]*\.[a-z]{2,}(?:\.[a-z]{2,})?)(?::\d+)?/gi);
    let ip = null;
    
    if (ipCandidates) {
      for (const c of ipCandidates) {
        const clean = c.split(':')[0];
        if (!clean.includes('minecraft-mp') && !clean.includes('twitter') && !clean.includes('.com/') && !clean.includes('.net/') && !clean.includes('.org/')) {
          ip = clean;
          break;
        }
      }
    }
    
    // Also try to get IP from the server detail page if we couldn't find it
    if (!ip) {
      const serverLink = row.match(/href="\/server-s(\d+)">([^<]+)</i);
      if (serverLink) {
        // The link text might be the IP or server name
        const linkText = serverLink[2].trim();
        if (/\d/.test(linkText) && linkText.includes('.')) {
          ip = linkText.split(':')[0];
        }
      }
    }
    
    rows.push({ serverId, ts, name, videoUrl, ip });
  }
  
  return rows;
}

async function downloadVideo(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }, res => {
      if (res.statusCode >= 400) return resolve(null);
      const chunks = []; res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}

async function uploadVideo(filename, buffer) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`);
    const req = https.request({ hostname: url.hostname, port: 443, path: url.pathname, method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'video/mp4', 'Content-Length': buffer.length }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => res.statusCode >= 400 ? reject(new Error(d.slice(0,200))) : resolve(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`)); });
    req.on('error', reject); req.write(buffer); req.end();
  });
}

async function updateBanner(ip, url) {
  return new Promise((resolve, reject) => {
    const p = new URL(`${SUPABASE_URL}/rest/v1/servers?ip=eq.${encodeURIComponent(ip)}`);
    const payload = JSON.stringify({ banner: url });
    const req = https.request({ hostname: p.hostname, port: 443, path: p.pathname + p.search, method: 'PATCH',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), Prefer: 'return=minimal' }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => res.statusCode >= 400 ? reject(new Error(d.slice(0,200))) : resolve()); });
    req.on('error', reject); req.write(payload); req.end();
  });
}

async function main() {
  const ourServers = JSON.parse(fs.readFileSync(path.join(__dirname, 'pvp-servers.json'), 'utf-8'));
  const ourIPs = new Map(ourServers.map(s => [s.i.toLowerCase(), s]));
  
  console.log('🎬 Scraping minecraft-mp.com video banners\n');
  
  // Crawl pages
  const pages = [];
  pages.push(`${MP}/`);
  pages.push(`${MP}/serverlist/`);
  for (let t of ['pvp','survival','minigames','hcf','bedwars','skyblock','prison','smp','factions','hardcore','anarchy','lifesteal']) {
    pages.push(`${MP}/type/${t}/`);
  }
  for (let p = 2; p <= 30; p++) {
    pages.push(`${MP}/serverlist/?page=${p}`);
    pages.push(`${MP}/type/pvp/?page=${p}`);
    pages.push(`${MP}/type/survival/?page=${p}`);
  }
  
  const allBanners = [];
  const seenIds = new Set();
  
  for (let i = 0; i < pages.length; i++) {
    const html = await fetchHTML(pages[i]);
    if (html) {
      const rows = parseRow(html);
      for (const r of rows) {
        if (!seenIds.has(r.serverId)) {
          seenIds.add(r.serverId);
          allBanners.push(r);
        }
      }
    }
    if (i % 30 === 0) console.log(`  Page ${i+1}/${pages.length}: ${allBanners.length} banners`);
    await delay(500);
  }
  
  console.log(`\n📊 Found ${allBanners.length} unique video banners`);
  console.log(`With IP from listing: ${allBanners.filter(b => b.ip).length}`);
  console.log(`Missing IP: ${allBanners.filter(b => !b.ip).length}`);
  
  // Now resolve IPs for banners without IP from detail page
  const withoutIP = allBanners.filter(b => !b.ip);
  console.log(`\nResolving IPs for ${withoutIP.length} banners...`);
  
  for (let i = 0; i < withoutIP.length; i++) {
    const b = withoutIP[i];
    const html = await fetchHTML(`${MP}/server-s${b.serverId}`);
    if (html) {
      // Look for IP in server page
      const ipMatch = html.match(/Server IP[\s\S]{0,500}?>([a-z0-9][-a-z0-9]*(?:\.[a-z]{2,})+)\s*</i);
      if (ipMatch && !ipMatch[1].includes('minecraft-mp')) {
        b.ip = ipMatch[1];
      }
      // Try another pattern - in the URL or title
      else {
        const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        if (h1) {
          const ipFromTitle = h1[1].match(/([a-z0-9][-a-z0-9]*\.[a-z]{2,}(?:\.[a-z]{2,})?)/i);
          if (ipFromTitle) b.ip = ipFromTitle[1];
        }
      }
    }
    if (i % 15 === 0) console.log(`  Resolved ${i+1}/${withoutIP.length} (${b.ip || 'unknown'})`);
    await delay(400);
  }
  
  const withIP = allBanners.filter(b => b.ip);
  console.log(`\nAfter resolution: ${withIP.length} banners with IP`);
  
  // Match to our servers
  const matched = [];
  for (const b of withIP) {
    const ip = b.ip.split(':')[0].toLowerCase();
    const s = ourIPs.get(ip);
    if (s) { matched.push({ server: s, ...b }); continue; }
  }
  
  console.log(`Matched to our servers: ${matched.length}`);
  
  if (matched.length === 0) {
    console.log('\nNo matches. Here are the servers that have video banners:');
    withIP.slice(0, 20).forEach(b => console.log(`  ${b.name} → ${b.ip}`));
    return;
  }
  
  // Download, upload, and update
  let done = 0, skipped = 0, failed = 0;
  console.log(`\n📤 Downloading and uploading ${matched.length} video banners...\n`);
  
  for (const m of matched) {
    console.log(`  ${done+skipped+failed+1}/${matched.length}: ${m.server.n} (${m.ip})`);
    try {
      const buf = await downloadVideo(m.videoUrl);
      if (!buf || buf.length < 2000) { console.log(`    ✗ Download failed (${buf ? buf.length : 0} bytes)`); failed++; continue; }
      const fn = `video-${m.server.i.replace(/[^a-z0-9.]/g, '-')}.mp4`;
      const url = await uploadVideo(fn, buf);
      await updateBanner(m.server.i, url);
      console.log(`    ✅ Done`);
      done++;
    } catch (e) {
      if (e.message.includes('409') || e.message.includes('Duplicate')) {
        console.log(`    ⏭️ Already exists (skipping)`);
        skipped++;
      } else {
        console.log(`    ❌ ${e.message.slice(0, 120)}`);
        failed++;
      }
    }
    await delay(800);
  }
  
  console.log(`\n🎬 Results:`);
  console.log(`  ✅ New uploads: ${done}`);
  console.log(`  ⏭️ Already existed: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${done + skipped + failed}/${matched.length}`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });