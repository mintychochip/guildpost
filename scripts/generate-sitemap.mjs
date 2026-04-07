#!/usr/bin/env node
/**
 * Sitemap Generator for GuildPost
 * Generates sitemap.xml with all server URLs
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwMDQsImV4cCI6MjA5MDkyNzAwNH0.35hrTSgxQnICpLOY3g6W3eNxxe7DKCc3q165tyb0Ieo';

const BASE_URL = 'https://guildpost.tech';
const STATIC_PAGES = [
  '',
  '/minecraft',
  '/submit',
  '/favorites',
  '/compare',
  '/minecraft/pvp',
  '/minecraft/survival',
  '/minecraft/skyblock',
  '/minecraft/factions',
  '/minecraft/smp',
  '/minecraft/minigames',
  '/minecraft/prison',
  '/minecraft/creative',
  '/minecraft/bedwars',
  '/minecraft/towny',
  '/minecraft/economy',
  '/minecraft/roleplay',
];

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  // Fetch all server IDs
  const { data: servers, error } = await supabase
    .from('servers')
    .select('id, updated_at');
  
  if (error) {
    console.error('❌ Error fetching servers:', error);
    return;
  }
  
  const urls = [];
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      loc: `${BASE_URL}${page}`,
      changefreq: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? '1.0' : '0.8'
    });
  });
  
  // Add server pages
  servers?.forEach(server => {
    urls.push({
      loc: `${BASE_URL}/servers/${server.id}`,
      changefreq: 'daily',
      priority: '0.9',
      lastmod: server.updated_at || new Date().toISOString().split('T')[0]
    });
  });
  
  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  // Write to file
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml);
  
  console.log(`✅ Sitemap generated: ${urls.length} URLs`);
  console.log(`📁 Saved to: ${outputPath}`);
}

generateSitemap().catch(console.error);
