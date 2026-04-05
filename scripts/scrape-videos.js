#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1MTAwNCwiZXhwIjoyMDkwOTI3MDA0fQ.XhD7HSa1RwnfhP5pCeHQ2dLErAPFysT2BkRF2VQVozE';
const BUCKET = 'banners';
const MP = 'https://minecraft-mp.com';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function html(url) {
  return new Promise(r => https.get(url, {headers:{'User-Agent':'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36'},timeout:15000}, res => {
    let d=''; res.on('data',c=>d+=c); res.on('end',()=>r(res.statusCode<400?d:null));
  }).on('error',()=>r(null)));
}
function download(url) {
  return new Promise(r => https.get(url, {headers:{'User-Agent':'Mozilla/5.0'},timeout:30000}, res => {
    if(res.statusCode>=400) return r(null);
    const c=[]; res.on('data',d=>c.push(d)); res.on('end',()=>r(Buffer.concat(c)));
  }).on('error',()=>r(null)));
}

async function main() {
  const our = JSON.parse(fs.readFileSync(path.join(__dirname,'pvp-servers.json'),'utf-8'));
  const ourMap = new Map(our.map(s=>[s.i.toLowerCase(),s]));

  console.log('🎬 Scraping minecraft-mp.com video banners\n');

  // All known banner IDs (from crawling the main page)
  const pages = [`${MP}/`,`${MP}/serverlist/`];
  for(let t of ['pvp','survival','minigames','hcf','bedwars','skyblock','prison','smp','factions','hardcore','lifesteal','anarchy','uhc']) pages.push(`${MP}/type/${t}/`);
  for(let p=2;p<=30;p++){ pages.push(`${MP}/serverlist/?page=${p}`); pages.push(`${MP}/type/pvp/?page=${p}`); }

  const banners = [];
  const seenIds = new Set();

  for(let i=0;i<pages.length;i++){
    const h = await html(pages[i]);
    if(h){
      for(const m of h.matchAll(/banner-(\d+)-(\d+)\.mp4/g)){
        if(!seenIds.has(m[1])){
          seenIds.add(m[1]);
          banners.push({id:m[1], ts:m[2], videoUrl:`https://minecraft-mp.com/images/banners/banner-${m[1]}-${m[2]}.mp4`, ip:null, name:null});
        }
      }
    }
    if(i%30===0) process.stdout.write(`\r  Page ${i}/${pages.length}: ${banners.length} unique banners`);
    await delay(400);
  }

  console.log(`\n\n📊 Found ${banners.length} unique video banners`);
  console.log('🔍 Resolving IPs from server detail pages...\n');

  for(let i=0;i<banners.length;i++){
    const h = await html(`${MP}/server-s${banners[i].id}`);
    if(h){
      // IP is in data-clipboard-text
      const ipM = h.match(/data-clipboard-text="([^"]+)"/);
      if(ipM) banners[i].ip = ipM[1];
      // Name is in <title> or h1
      const titleM = h.match(/<title>([^<]+)<\/title>/);
      if(titleM) banners[i].name = titleM[1].replace(' | Minecraft Server','').trim();
    }
    if((i+1)%25===0) console.log(`  Resolved ${i+1}/${banners.length} (${banners.filter(b=>b.ip).length} with IP)`);
    await delay(350);
  }

  const withIP = banners.filter(b=>b.ip);
  console.log(`\n🎯 ${withIP.length}/${banners.length} banners with IP resolved\n`);

  // Match to our servers
  const matched = [];
  for(const b of withIP){
    const s = ourMap.get(b.ip.toLowerCase());
    if(s){ matched.push({server:s, ...b}); continue; }
    // Fuzzy name match
    for(const s of our){
      const n1 = s.n.toLowerCase().replace(/[^a-z0-9]/g,'');
      const n2 = (b.name||'').toLowerCase().replace(/[^a-z0-9]/g,'');
      if(n1 && n2 && (n1===n2 || n1.includes(n2) || n2.includes(n1))){
        matched.push({server:s, ...b});
        break;
      }
    }
    if(!matched.find(m=>m.server.i===b.ip || m.server.i.toLowerCase()===b.ip.toLowerCase())){
      // Show unmatched so user knows what we found
    }
  }

  // Show unmatched banners with IPs
  const matchedIPs = new Set(matched.map(m=>m.server.i.toLowerCase()));
  console.log('📸 Banners we found (not in our list):');
  withIP.filter(b=>!matchedIPs.has(b.ip.toLowerCase())).forEach(b=>{
    console.log(`  ${b.name} → ${b.ip}`);
  });

  console.log(`\n✅ Matched ${matched.length}/${withIP.length} to our servers`);
  matched.forEach(m=>console.log(`  🎬 ${m.server.n} ← ${m.name} (${m.ip})`));

  if(matched.length===0) return;

  // Download + upload
  let done=0, skip=0, fail=0;
  console.log(`\n📤 Downloading and uploading ${matched.length} banners...\n`);
  for(const m of matched){
    try {
      process.stdout.write(`  ${done+skip+fail+1}/${matched.length}: ${m.server.n}`);
      const buf = await download(m.videoUrl);
      if(!buf||buf.length<2000){ process.stdout.write(' ✗ Download failed\n'); fail++; continue; }
      const fn = `video-${m.server.i.replace(/[^a-z0-9.]/g,'-')}.mp4`;
      const url = await upload(fn, buf);
      await updateBanner(m.server.i, url);
      process.stdout.write(' ✅\n');
      done++;
    } catch(e){
      if(e.message.includes('409')||e.message.includes('Duplicate')){ process.stdout.write(' ⏭️ exists\n'); skip++; }
      else { process.stdout.write(` ❌ ${e.message.slice(0,80)}\n`); fail++; }
    }
    await delay(800);
  }
  console.log(`\n🎬 Done: ${done} new, ${skip} existing, ${fail} failed, ${done+skip}/${matched.length} total`);
}

function upload(name, buf){
  return new Promise((ok,no)=>{
    const u=new URL(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`);
    const r=https.request({hostname:u.hostname,port:443,path:u.pathname,method:'POST',
      headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'video/mp4','Content-Length':buf.length}},
      res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>res.statusCode>=400?no(new Error(d.slice(0,200))):ok(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`));});
    r.on('error',no);r.write(buf);r.end();
  });
}
function updateBanner(ip,url){
  return new Promise((ok,no)=>{
    const p=new URL(`${SUPABASE_URL}/rest/v1/servers?ip=eq.${encodeURIComponent(ip)}`);
    const payload=JSON.stringify({banner:url});
    const r=https.request({hostname:p.hostname,port:443,path:p.pathname+p.search,method:'PATCH',
      headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload),Prefer:'return=minimal'}},
      res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>res.statusCode>=400?no(new Error(d.slice(0,200))):ok());});
    r.on('error',no);r.write(payload);r.end();
  });
}

main().catch(e=>{console.error('Fatal:',e.message);process.exit(1);});