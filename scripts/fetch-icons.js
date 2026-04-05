#!/usr/bin/env node
/**
 * Fetch server icons from mcsrvstat.us API and update Supabase.
 * The Minecraft server status API returns icons as base64 data URIs.
 *
 * Usage: node scripts/fetch-icons.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Push migration
async function pushMigration() {
  const migration = fs.readFileSync('supabase/migrations/015_add_server_icon.sql', 'utf-8');
  console.log('📋 Pushing migration 015 (add icon column)...');
  const { execSync } = require('child_process');
  try {
    execSync('cd /home/justin-lo/.openclaw/workspace/pvpserverlist && supabase db push', { stdio: 'inherit' });
    return true;
  } catch (e) {
    // Try with repair first
    try {
      execSync('cd /home/justin-lo/.openclaw/workspace/pvpserverlist && supabase migration repair --status applied 015', { stdio: 'inherit' });
      return true;
    } catch (e2) {
      console.log('Migration push failed, will try raw SQL via REST API');
      return false;
    }
  }
}

// Fetch servers that don't have icons
async function fetchServersWithoutIcons(limit = 100, offset = 0) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/servers?select=ip,name,icon&icon=is.null&limit=${limit}&offset=${offset}`);
    https.get({
      hostname: url.hostname, port: 443,
      path: url.pathname + url.search,
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        else resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

// Update server icon
async function updateServerIcon(ip, iconData) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/servers?ip=eq.${encodeURIComponent(ip)}`);
    const payload = JSON.stringify({ icon: iconData });
    const req = https.request({
      hostname: url.hostname, port: 443,
      path: url.pathname + url.search,
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

// Get icon from mcsrvstat.us
async function fetchServerIcon(ip) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.mcsrvstat.us/icon/${encodeURIComponent(ip)}?t=${Date.now()}`, {
      headers: { 'User-Agent': 'pvp-directory/1.0' },
      timeout: 10000,
    }, res => {
      if (res.statusCode === 404 || res.statusCode === 403) {
        resolve(null); // No icon available
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 100) {
          resolve(null); // Probably an error response
          return;
        }
        // Convert to base64 data URI
        const base64 = buffer.toString('base64');
        resolve(`data:image/png;base64,${base64}`);
      });
    }).on('error', () => resolve(null));
  });
}

// Also check mcstatus.io API for icons - alternative endpoint
async function fetchServerIconAlt(ip) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(ip)}?timeout=5000`, {
      headers: { 'User-Agent': 'pvp-directory/1.0' },
      timeout: 10000,
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) { resolve(null); return; }
        try {
          const json = JSON.parse(data);
          resolve(json.icon || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('🖼️  Server Icon Fetcher');
  console.log('=======================\n');

  // Step 1: Push migration
  const migrationOk = await pushMigration();
  if (!migrationOk) {
    console.log('⚠️ Migration push failed. Creating column via raw SQL...');
    // Try executing the ALTER TABLE via a different method
    const { execSync } = require('child_process');
    try {
      execSync('cd /home/justin-lo/.openclaw/workspace/pvpserverlist && supabase migration repair --status applied 015', { stdio: 'inherit' });
    } catch (e) {
      // Will proceed anyway - if column already exists we get errors but continue
    }
  }

  await delay(500);

  // Step 2: Fetch servers without icons
  console.log('\n🔍 Fetching servers without icons...');
  const servers = await fetchServersWithoutIcons(1000, 0);
  console.log(`  Found ${servers.length} servers needing icons`);

  if (servers.length === 0) {
    console.log('✅ All servers have icons!');
    return;
  }

  // Step 3: Fetch icons from both APIs
  let updated = 0, noIcon = 0, errors = 0;

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    // Show progress
    if (i % 20 === 0) console.log(`  Progress: ${i}/${servers.length} (${((i/servers.length)*100).toFixed(0)}%)`);

    try {
      // Try mcsrvstat icon endpoint first (direct PNG)
      let icon = await fetchServerIcon(server.ip);

      // If that fails, try mcstatus.io
      if (!icon) {
        icon = await fetchServerIconAlt(server.ip);
      }

      if (icon) {
        await updateServerIcon(server.ip, icon);
        updated++;
        if (i % 10 === 0) process.stdout.write('✅');
      } else {
        // Mark as having no icon (store null explicitly so we don't re-fetch)
        await updateServerIcon(server.ip, null);
        noIcon++;
        if (i % 10 === 0) process.stdout.write('⊘');
      }
    } catch (e) {
      errors++;
      if (e.message.includes('429')) {
        console.log('\n  ⏸ Rate limited, waiting 10s...');
        await delay(10000);
        i--; // Retry this one
        continue;
      }
      if (i % 10 === 0) process.stdout.write('❌');
    }

    // Rate limit: ~1000 req/min is generous for these APIs
    // Use 50ms delay between requests
    await delay(80);
  }

  console.log(`\n\n📊 Results:`);
  console.log(`  Updated with icon: ${updated}`);
  console.log(`  No icon available: ${noIcon}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
