import type { APIRoute } from 'astro';

const SITE_URL = 'https://guildpost.tech';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface Server {
  id: string;
  name: string;
  description: string;
  ip: string;
  port: number;
  tags: string[];
  vote_count: number;
  players_online: number;
  max_players: number;
  status: string;
  created_at: string;
  website?: string;
  version?: string;
  edition?: string;
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    return new Response('Service unavailable', {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
  
  try {
    // Fetch last 20 servers ordered by created_at desc
    const response = await fetch(
      `${supabaseUrl}/rest/v1/servers?select=id,name,description,ip,port,tags,vote_count,players_online,max_players,status,created_at,website,version,edition&order=created_at.desc&limit=20`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${await response.text()}`);
    }
    
    const servers: Server[] = await response.json();
    const pubDate = servers.length > 0 ? formatRssDate(servers[0].created_at) : formatRssDate(new Date().toISOString());
    
    const items = servers.map(server => {
      const serverUrl = `${SITE_URL}/servers/${server.id}`;
      const title = escapeXml(server.name);
      
      // Build description with server details
      let description = '';
      if (server.description) {
        description += escapeXml(server.description);
      }
      
      const details: string[] = [];
      if (server.players_online !== undefined) {
        details.push(`${server.players_online}/${server.max_players || '?'} players online`);
      }
      if (server.vote_count) {
        details.push(`${server.vote_count} votes`);
      }
      if (server.status) {
        details.push(`Status: ${server.status}`);
      }
      if (server.version) {
        details.push(`Version: ${server.version}`);
      }
      if (server.edition) {
        details.push(`Edition: ${server.edition}`);
      }
      if (server.tags && server.tags.length > 0) {
        details.push(`Tags: ${server.tags.join(', ')}`);
      }
      
      if (details.length > 0) {
        description += description ? '<br/><br/>' : '';
        description += details.join(' • ');
      }
      
      description += `<br/><br/>Connect: ${escapeXml(server.ip)}:${server.port}`;
      
      if (server.website) {
        description += `<br/>Website: <a href="${escapeXml(server.website)}">${escapeXml(server.website)}</a>`;
      }
      
      return `    <item>
      <title>${title}</title>
      <description><![CDATA[${description}]]></description>
      <link>${serverUrl}</link>
      <guid isPermaLink="true">${serverUrl}</guid>
      <pubDate>${formatRssDate(server.created_at)}</pubDate>
      ${server.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
    }).join('\n');
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GuildPost - New Minecraft Servers</title>
    <description>Recently added Minecraft servers on GuildPost. Discover the latest multiplayer servers for Java and Bedrock editions.</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <pubDate>${pubDate}</pubDate>
    <lastBuildDate>${formatRssDate(new Date().toISOString())}</lastBuildDate>
    <image>
      <url>${SITE_URL}/favicon.png</url>
      <title>GuildPost</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
    
  } catch (err: any) {
    console.error('RSS feed error:', err);
    return new Response('Failed to generate RSS feed', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
