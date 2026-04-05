#!/usr/bin/env node
/**
 * Uploads local banner images to Supabase Storage and updates DB
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';
const BUCKET = 'banners';
const BANNER_DIR = path.join(__dirname, 'banner-output');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function uploadBanner(filename, buffer) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        } else {
          resolve(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`);
        }
      });
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

async function updateServerBanner(ip, bannerUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${SUPABASE_URL}/rest/v1/servers?ip=eq.${encodeURIComponent(ip)}`);
    const payload = JSON.stringify({ banner: bannerUrl });
    const req = https.request({
      hostname: parsed.hostname, port: 443,
      path: parsed.pathname + parsed.search,
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Prefer: 'return=minimal',
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        else resolve(res.statusCode);
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const files = fs.readdirSync(BANNER_DIR).filter(f => f.endsWith('.png'));
  console.log(`📤 Uploading ${files.length} banners to Supabase Storage...\n`);

  let uploaded = 0;
  let dbUpdated = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filepath = path.join(BANNER_DIR, file);
    const buffer = fs.readFileSync(filepath);

    try {
      const url = await uploadBanner(file, buffer);
      uploaded++;

      // Extract IP from filename (e.g. "mc.hypixel.net.png" → "mc.hypixel.net")
      const ip = file.replace('.png', '');
      await updateServerBanner(ip, url);
      dbUpdated++;

      if ((i + 1) % 100 === 0) {
        const pct = ((i + 1) / files.length * 100).toFixed(0);
        console.log(`  ✅ ${i + 1}/${files.length} (${pct}%)`);
      }
    } catch (e) {
      errors++;
      if (e.message.includes('429')) {
        console.log(`  ⏸ Rate limited, waiting 10s...`);
        await delay(10000);
        i--;
        continue;
      }
      if (errors <= 5) console.log(`  ❌ ${file}: ${e.message.slice(0, 100)}`);
    }

    await delay(200);
  }

  console.log(`\n📊 Results:`);
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  DB updated: ${dbUpdated}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
