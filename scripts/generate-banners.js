#!/usr/bin/env node
/**
 * Auto-generate PvP-themed banners for all servers.
 * Creates 1092x380 banners with server name, icon, and tags.
 * Uploads to Supabase Storage and stores URL in DB.
 *
 * Usage: node scripts/generate-banners.js
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';
const BUCKET = 'banners';
const SERVERS_JSON = path.join(__dirname, 'pvp-servers.json');
const OUTPUT_DIR = path.join(__dirname, 'banner-output');

const CANVAS_W = 1092;
const CANVAS_H = 380;

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Color palettes per tag type ──
const TAG_COLORS = {
  'HCF':        ['#FF4444', '#FF6B6B'],
  'Factions':   ['#FF6B35', '#FF8C42'],
  'PvP':        ['#E74C3C', '#C0392B'],
  'Practice':   ['#9B59B6', '#8E44AD'],
  'KitPvP':     ['#E67E22', '#D35400'],
  'Duels':      ['#2ECC71', '#27AE60'],
  'Skywars':    ['#3498DB', '#2980B9'],
  'Bedwars':    ['#FFB74D', '#FF9800'],
  'Skyblock':   ['#00BCD4', '#0097A7'],
  'Prison':     ['#795548', '#5D4037'],
  'UHC':        ['#4CAF50', '#388E3C'],
  'Lifesteal':  ['#8BC34A', '#558B2F'],
  'Anarchy':    ['#607D8B', '#455A64'],
  'CrystalPvP': ['#E040FB', '#AA00FF'],
  'Minigames':  ['#FF7043', '#F4511E'],
  'Survival':   ['#4CAF50', '#2E7D32'],
  'OPPrison':   ['#A1887F', '#795548'],
  'SMP':        ['#26A69A', '#00897B'],
  'Pixelmon':   ['#AB47BC', '#7B1FA2'],
  'RPG':        ['#5C6BC0', '#3F51B5'],
  'FFA':        ['#EF5350', '#E53935'],
  'NoDebuff':   ['#26C6DA', '#00ACC1'],
  'Cracked':    ['#78909C', '#546E7A'],
};

function getColorsForServer(tags) {
  for (const tag of tags) {
    if (TAG_COLORS[tag]) return TAG_COLORS[tag];
  }
  // Default gradient
  return ['#6366F1', '#4F46E5'];
}

function hashColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const s = 60 + ((Math.abs(hash) >> 8) % 20);
  const l = 35 + ((Math.abs(hash) >> 16) % 15);
  return { bg1: `hsl(${h}, ${s}%, ${l}%)`, bg2: `hsl(${(h + 30) % 360}, ${s}%, ${l - 10}%)` };
}

// ── Generate banner ──
function generateBanner(server) {
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  const ctx = canvas.getContext('2d');

  const colors = getColorsForServer(server.t);
  const hashC = hashColor(server.n);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_W, 0);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Overlay pattern - diagonal lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = -CANVAS_H; i < CANVAS_W + CANVAS_H; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + CANVAS_H, CANVAS_H);
    ctx.stroke();
  }

  // Subtle particle dots
  const rng = (seed) => {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  };
  const rand = rng(server.n.length * 1000);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 40; i++) {
    const x = rand() * CANVAS_W;
    const y = rand() * CANVAS_H;
    const r = rand() * 4 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Left accent bar
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(0, 0, 8, CANVAS_H);

  // Dark overlay for readability
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, CANVAS_H - 100, CANVAS_W, 100);

  // ── Server icon (if available) ──
  // We'll render without for now, add later
  // Icon placeholder circle
  ctx.beginPath();
  ctx.arc(80, CANVAS_H / 2 - 20, 60, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Icon initials
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = 'bold 40px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initials = server.n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  ctx.fillText(initials, 80, CANVAS_H / 2 - 22);

  // ── Server name ──
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  // Shadow for text
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial, sans-serif';
  const name = server.n.length > 35 ? server.n.substring(0, 32) + '...' : server.n;
  ctx.fillText(name, 170, CANVAS_H / 2 - 50);

  // ── Server IP ──
  ctx.font = '22px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.shadowBlur = 8;
  ctx.fillText(server.i, 170, CANVAS_H / 2 + 5);

  // ── Tags ──
  ctx.shadowBlur = 0;
  let tagX = 170;
  const tagY = CANVAS_H / 2 + 60;
  
  for (const tag of (server.t || []).slice(0, 5)) {
    ctx.font = '18px Arial, sans-serif';
    const textW = ctx.measureText(tag).width;
    const pillW = textW + 20;
    const pillH = 28;

    // Pill background
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(tagX, tagY - pillH/2, pillW, pillH, 6);
    ctx.fill();

    // Pill text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '14px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, tagX + 10, tagY);
    
    tagX += pillW + 6;
  }

  // ── "PvP Index" branding ──
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('pvp-directory.vercel.app', CANVAS_W - 20, CANVAS_H - 20);

  // ── Vote count ──
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'right';
  const votes = server.votes ? server.votes.toLocaleString() + ' votes' : '';
  ctx.fillText(votes, CANVAS_W - 20, CANVAS_H / 2 - 50);

  return canvas;
}

// ── Save banner to disk and upload ──
async function saveBanner(canvas, filename) {
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
  return buffer;
}

// ── Upload to Supabase Storage ──
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
          const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
          resolve(url);
        }
      });
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

// ── Update server in DB ──
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

// ── Check if bucket exists ──
async function checkBucket() {
  return new Promise((resolve, reject) => {
    https.get(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const buckets = JSON.parse(data);
          resolve(buckets.some(b => b.id === BUCKET || b.name === BUCKET));
        } catch { resolve(false); }
      });
    }).on('error', reject);
  });
}

async function createBucket() {
  return new Promise((resolve, reject) => {
    const parsed = new URL(`${SUPABASE_URL}/storage/v1/bucket`);
    const payload = JSON.stringify({ id: BUCKET, name: BUCKET, public: true });
    const req = https.request({
      hostname: parsed.hostname, port: 443,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(true);
        } else if (res.statusCode === 400 && data.includes('already exists')) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🎨 Auto-Generating PvP Banners');
  console.log('=============================\n');

  const servers = JSON.parse(fs.readFileSync(SERVERS_JSON, 'utf-8'));
  console.log(`📋 ${servers.length} servers loaded`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check/create bucket
  console.log('\n🪣 Checking Supabase Storage bucket...');
  const bucketExists = await checkBucket();
  if (!bucketExists) {
    console.log('  Creating "banners" bucket...');
    const created = await createBucket();
    if (!created) {
      console.log('  ⚠️ Could not create bucket. Banners will be stored locally only.');
      console.log('  Manually create a public bucket named "banners" in Supabase Dashboard.');
    } else {
      console.log('  ✅ Bucket created');
    }
  } else {
    console.log('  ✅ Bucket exists');
  }

  // Generate and upload
  let uploaded = 0;
  let local = 0;
  let errors = 0;

  for (let i = 0; i < servers.length; i++) {
    const s = servers[i];
    if ((i + 1) % 50 === 0 || i === 0) {
      console.log(`  Generating ${i + 1}/${servers.length}...`);
    }

    try {
      const canvas = generateBanner(s);
      const filename = `${s.i.replace(/[^a-z0-9.]/g, '-').replace(/-+/g, '-')}.png`;
      
      // Save locally (always)
      await saveBanner(canvas, filename);
      local++;

      // Upload to Supabase (if bucket exists)
      if (bucketExists) {
        const buffer = canvas.toBuffer('image/png');
        await uploadBanner(filename, buffer);
        const bannerUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
        await updateServerBanner(s.i, bannerUrl);
        uploaded++;
        
        if ((i + 1) % 100 === 0) {
          console.log(`    ✅ ${i + 1}/${servers.length} banners saved + uploaded`);
        }
      } else {
        if ((i + 1) % 500 === 0) {
          console.log(`    💾 ${i + 1}/${servers.length} banners saved locally`);
        }
      }
    } catch (e) {
      errors++;
      if (errors <= 3) console.log(`  ❌ Error for ${s.n}: ${e.message.slice(0, 100)}`);
    }

    // Small delay to not hammer the API
    if (i % 5 === 0) await delay(100);
  }

  console.log(`\n📊 Results:`);
  console.log(`  Generated: ${servers.length} banners`);
  console.log(`  Saved locally: ${local}`);
  console.log(`  Uploaded to Supabase: ${uploaded}`);
  console.log(`  Errors: ${errors}`);
  if (bucketExists) {
    console.log(`\n💾 Banners available at: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`);
  } else {
    console.log(`\n💾 Banners saved to: ${OUTPUT_DIR}/`);
  }
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
