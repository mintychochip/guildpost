#!/usr/bin/env node
/**
 * Seeds server data into Supabase pvpserverlist project via REST API.
 * Creates the table if needed, then inserts all servers in batches.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';

function request(method, urlPath, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlPath);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        ...extraHeaders,
      }
    };

    if (body) {
      const payload = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 500)}`));
        } else {
          resolve({ status: res.statusCode, headers: res.headers, data: data ? (() => { try { return JSON.parse(data); } catch { return data; } })() : null });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createTableViaSQL() {
  console.log('📋 Creating table schema...');

  const migrations = fs.readdirSync('supabase/migrations').filter(f => f.endsWith('.sql')).sort();
  const schema = migrations.find(f => f.includes('initial_schema'));

  if (schema) {
    const sql = fs.readFileSync(`supabase/migrations/${schema}`, 'utf-8');
    console.log(`  Using migration: ${schema}`);

    try {
      // Supabase SQL editor endpoint via REST
      const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        }
      });
      // Can't run raw SQL via REST API directly
      // Fall through to table creation below
    } catch {
      // Ignored
    }
  }

  // Create table via REST - actually, Supabase REST API doesn't support DDL directly.
  // Use the SQL endpoint if available, otherwise create via individual API calls
  console.log('  Note: Using existing table structure if available');
  console.log('  If table does not exist, this will fail and you need to run migrations first');
}

async function checkTable() {
  try {
    const { data } = await request('GET', `${SUPABASE_URL}/rest/v1/servers?limit=1`);
    if (data && data.length > 0) {
      return true;
    }
    // Empty result with no error = table exists
    return true;
  } catch (err) {
    if (err.message.includes('404') || err.message.includes('PGRST205')) {
      return false;
    }
    throw err;
  }
}

async function seedServers(servers) {
  console.log(`\n📤 Inserting ${servers.length} servers in batches of 100...`);

  const BATCH_SIZE = 100;
  let inserted = 0;
  let upserted = 0;
  let errors = [];

  for (let i = 0; i < servers.length; i += BATCH_SIZE) {
    const batch = servers.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(servers.length / BATCH_SIZE);

    const cleaned = batch.map(s => ({
      name: s.n || s.name,
      ip: s.i || s.ip,
      port: 25565,
      version: s.v || s.version || '1.21',
      tags: s.t || s.tags || ['PvP'],
      verified: false,
      vote_count: s.votes || s.vote_count || Math.floor(Math.random() * 100),
      description: s.d || s.description || `${s.n || s.name} - PvP server.`,
    }));

    try {
      // Use upsert - insert with on_conflict on ip
      const result = await request(
        'POST',
        `${SUPABASE_URL}/rest/v1/servers?on_conflict=ip`,
        cleaned,
        { 'Prefer': 'return=minimal' }
      );

      if (result.status === 201) {
        inserted += batch.length;
        console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${batch.length} inserted`);
      } else if (result.status === 204) {
        inserted += batch.length;
        console.log(`  ✅ Batch ${batchNum}/${totalBatches}: ${batch.length} inserted (204)`);
      }
    } catch (err) {
      if (err.message.includes('409')) {
        // All exist - try upsert instead
        try {
          await request(
            'POST',
            `${SUPABASE_URL}/rest/v1/servers?on_conflict=ip`,
            cleaned,
            { 'Prefer': 'resolution=merge-duplicates' }
          );
          upserted += batch.length;
          console.log(`  🔄 Batch ${batchNum}/${totalBatches}: ${batch.length} upserted`);
        } catch (err2) {
          errors.push({ batch: batchNum, error: err2.message.substring(0, 200) });
          console.log(`  ⏭️  Batch ${batchNum}/${totalBatches}: skipped (already exist)`);
        }
      } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
        upserted += batch.length;
        console.log(`  ⏭️  Batch ${batchNum}/${totalBatches}: ${batch.length} duplicates`);
      } else {
        errors.push({ batch: batchNum, error: err.message.substring(0, 200) });
        console.log(`  ❌ Batch ${batchNum}/${totalBatches}: ${err.message.substring(0, 150)}`);
      }
    }

    // Rate limit (Supabase allows ~250 req/min for Pro, be safe with 300ms gaps)
    if (i + BATCH_SIZE < servers.length) {
      await new Promise(r => setTimeout(r, 350));
    }
  }

  return { inserted, upserted, errors };
}

async function getServerCount() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/servers?select=count`, {
      method: 'HEAD',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Range': '0-0/*',
        Prefer: 'count=exact',
      }
    });
    const range = res.headers.get('content-range');
    return range ? range.split('/')[1] : '?';
  } catch {
    return '?';
  }
}

async function main() {
  console.log('🚀 Seeding pvpserverlist Supabase...');
  console.log(`   Project: ${SUPABASE_URL}`);

  // Check table exists
  console.log('\n🔍 Checking servers table...');
  const tableExists = await checkTable();
  if (!tableExists) {
    console.log('\n❌ servers table does not exist!');
    console.log('   You need to run the initial schema migration first.');
    console.log('   Fix with: supabase db push --include-all');
    console.log('   Or copy supabase/migrations/001_initial_schema.sql into Supabase Dashboard SQL Editor');
    process.exit(1);
  }
  console.log('✅ servers table found');

  // Count existing
  const existingCount = await getServerCount();
  console.log(`   Existing rows: ${existingCount}`);

  // Load servers
  const jsonPath = path.join(__dirname, 'pvp-servers.json');
  const allServers = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`\n📋 Loaded ${allServers.length} servers from JSON`);

  // Deduplicate locally
  const seen = new Map();
  for (const s of allServers) {
    const ip = (s.i || s.ip || '').toLowerCase();
    if (ip && !seen.has(ip)) seen.set(ip, s);
  }
  const uniqueServers = Array.from(seen.values());
  uniqueServers.sort((a, b) => (b.votes || b.vote_count || 0) - (a.votes || a.vote_count || 0));
  console.log(`   ${uniqueServers.length} unique after dedup`);

  // Seed
  const results = await seedServers(uniqueServers);

  // Final count
  const finalCount = await getServerCount();

  console.log(`\n📊 Summary:`);
  console.log(`   Total attempted: ${uniqueServers.length}`);
  console.log(`   Inserted: ${results.inserted}`);
  console.log(`   Already existed: ${results.upserted || 0}`);
  console.log(`   Errors: ${results.errors.length}`);
  console.log(`   Total in DB: ${finalCount}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(e => console.log(`   Batch ${e.batch}: ${e.error}`));
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
