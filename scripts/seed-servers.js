#!/usr/bin/env node
/**
 * Seeds server data into Supabase via REST API.
 * Usage: node scripts/seed-servers.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function postJSON(requestPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(requestPath);
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
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
  const jsonPath = path.join(__dirname, 'pvp-servers.json');
  const servers = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${servers.length} servers from JSON`);

  // Deduplicate
  const seen = new Map();
  for (const s of servers) {
    const ip = s.i.toLowerCase();
    if (!seen.has(ip)) seen.set(ip, s);
  }
  const uniqueServers = Array.from(seen.values());
  uniqueServers.sort((a, b) => b.votes - a.votes);
  console.log(`${uniqueServers.length} unique servers`);

  // Clear existing data first (the 10 from old seed)
  console.log('\nClearing existing test data...');
  // Delete via REST
  const deleteReq = new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + '/rest/v1/servers?ip=neq.0'); // delete all
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
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
    req.end();
  });

  try {
    await deleteReq;
    console.log('  Cleared existing data');
  } catch (e) {
    console.log('  Clear warning:', e.message.slice(0, 150));
  }

  // Bulk insert with on_conflict
  console.log('\nInserting servers...');
  const BATCH = 50;
  let inserted = 0, skipped = 0;

  for (let i = 0; i < uniqueServers.length; i += BATCH) {
    const chunk = uniqueServers.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(uniqueServers.length / BATCH);

    const payload = chunk.map(s => ({
      name: s.n,
      ip: s.i,
      port: 25565,
      version: s.v,
      tags: s.t,
      verified: false,
      vote_count: s.votes,
      description: `${s.n} - ${s.t.slice(0, 3).join(' / ')}.`,
    }));

    try {
      await postJSON(`${SUPABASE_URL}/rest/v1/servers?on_conflict=ip`, payload);
      inserted += chunk.length;
      console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${chunk.length} inserted (total: ${inserted})`);
    } catch (e) {
      if (e.message.includes('200') || e.message.includes('201') || e.message.includes('204')) {
        inserted += chunk.length;
        console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${chunk.length} (total: ${inserted})`);
      } else if (e.message.includes('409')) {
        // Try with resolution=merge-duplicates (upsert)
        try {
          const url = new URL(`${SUPABASE_URL}/rest/v1/servers?on_conflict=ip`);
          const payload2 = JSON.stringify(payload.map(s => ({ ...s, vote_count: s.vote_count })));
          await new Promise((resolve, reject) => {
            const url = new URL(`${SUPABASE_URL}/rest/v1/servers?on_conflict=ip`);
            const req2 = https.request({
              hostname: url.hostname, port: 443,
              path: url.pathname + url.search,
              method: 'POST',
              headers: {
                apikey: SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload2),
                Prefer: 'resolution=merge-duplicates',
              },
            }, res => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
                else resolve();
              });
            });
            req2.on('error', reject);
            req2.write(payload2);
            req2.end();
          });
          inserted += chunk.length;
          console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${chunk.length} merged (total: ${inserted})`);
        } catch (e2) {
          if (e2.message.includes('200') || e2.message.includes('201') || e2.message.includes('204')) {
            inserted += chunk.length;
            console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${chunk.length} merged (total: ${inserted})`);
          } else {
            skipped += chunk.length;
            console.log(`  ⏭️  Batch ${batchNum}/${totalBatches}: ${chunk.length} skipped (total skip: ${skipped})`);
          }
        }
      } else {
        skipped += chunk.length;
        console.log(`  ❌ Batch ${batchNum}/${totalBatches}: ${chunk.length} skipped (total skip: ${skipped})`);
      }
    }

    if (i + BATCH < uniqueServers.length) await delay(250);
  }

  // Get final count
  console.log('\nFetching final count...');
  const countRes = await new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/servers?select=count&limit=0`);
    https.get({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: 'count=exact',
      },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const range = res.headers['content-range'];
        resolve({ status: res.statusCode, data: data.slice(0, 200), range });
      });
    }).on('error', reject);
  });

  console.log(`\n📊 Results:`);
  console.log(`  Attempted: ${uniqueServers.length}`);
  console.log(`  Inserted/Merged: ${inserted}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Content-Range: ${countRes.range}`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
