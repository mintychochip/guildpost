/**
 * Server Widget API
 * Returns embeddable widget HTML or JSON
 * GET /api/widgets/[id]?format=html&size=medium&theme=dark
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const GET: APIRoute = async ({ params, url, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const { id } = params;
  const format = url.searchParams.get('format') || 'html'; // html or json
  const size = url.searchParams.get('size') || 'medium'; // small, medium, large
  const theme = url.searchParams.get('theme') || 'dark'; // dark, light
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Server ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Fetch server data
    const response = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}&select=*`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }}
    );
    
    if (!response.ok) {
      throw new Error(`Supabase error: ${await response.text()}`);
    }
    
    const servers = await response.json();
    const server = servers[0];
    
    if (!server) {
      return new Response(JSON.stringify({ error: 'Server not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Return JSON if requested
    if (format === 'json') {
      return new Response(JSON.stringify({
        id: server.id,
        name: server.name,
        ip: server.ip,
        port: server.port,
        status: server.status,
        players_online: server.players_online || 0,
        max_players: server.max_players || 0,
        vote_count: server.vote_count || 0,
        version: server.version,
        description: server.description,
        website: server.website,
        url: `https://guildpost.tech/servers/${id}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate HTML widget
    const widgetHtml = generateWidgetHTML(server, size, theme);
    
    return new Response(widgetHtml, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
    
  } catch (err: any) {
    console.error('Widget API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate widget' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};

function generateWidgetHTML(server: any, size: string, theme: string): string {
  const isDark = theme === 'dark';
  const baseUrl = 'https://guildpost.tech';
  const serverUrl = `${baseUrl}/servers/${server.id}`;
  const voteUrl = `${baseUrl}/servers/${server.id}`;
  
  const colors = {
    dark: {
      bg: '#12121a',
      border: '#2a2a3a',
      text: '#ffffff',
      muted: '#8892b0',
      accent: '#00f5d4',
      accent2: '#ff3864',
      online: '#22c55e',
      offline: '#6b7280'
    },
    light: {
      bg: '#ffffff',
      border: '#e5e7eb',
      text: '#1f2937',
      muted: '#6b7280',
      accent: '#0ea5e9',
      accent2: '#ef4444',
      online: '#22c55e',
      offline: '#9ca3af'
    }
  };
  
  const c = colors[isDark ? 'dark' : 'light'];
  const isOnline = server.status === 'online';
  const playerPercent = server.max_players > 0 
    ? Math.round((server.players_online / server.max_players) * 100) 
    : 0;
  
  const sizeStyles = {
    small: {
      width: '240px',
      padding: '12px',
      titleSize: '14px',
      textSize: '12px',
      iconSize: '32px',
      showDescription: false,
      showVersion: false
    },
    medium: {
      width: '300px',
      padding: '16px',
      titleSize: '16px',
      textSize: '13px',
      iconSize: '48px',
      showDescription: true,
      showVersion: true
    },
    large: {
      width: '380px',
      padding: '20px',
      titleSize: '18px',
      textSize: '14px',
      iconSize: '64px',
      showDescription: true,
      showVersion: true
    }
  };
  
  const s = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium;
  
  // Truncate description for widget
  const description = server.description 
    ? server.description.slice(0, size === 'small' ? 50 : size === 'medium' ? 80 : 120) + '...'
    : '';
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: transparent;
    }
    .widget {
      width: ${s.width};
      background: ${c.bg};
      border: 2px solid ${c.border};
      border-radius: 12px;
      padding: ${s.padding};
      color: ${c.text};
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .widget-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .server-icon {
      width: ${s.iconSize};
      height: ${s.iconSize};
      border-radius: 8px;
      background: ${c.border};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .server-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .server-icon svg {
      width: 50%;
      height: 50%;
      color: ${c.accent};
    }
    .server-info {
      flex: 1;
      min-width: 0;
    }
    .server-name {
      font-size: ${s.titleSize};
      font-weight: 700;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .server-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: ${isOnline ? c.online : c.offline};
      margin-top: 4px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${isOnline ? c.online : c.offline};
      ${isOnline ? 'animation: pulse 2s infinite;' : ''}
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .server-description {
      font-size: ${s.textSize};
      color: ${c.muted};
      line-height: 1.5;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .player-bar {
      margin-bottom: 12px;
    }
    .player-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: ${c.muted};
      margin-bottom: 4px;
    }
    .player-count {
      color: ${c.text};
      font-weight: 600;
    }
    .player-count.online { color: ${c.accent}; }
    .player-count.full { color: ${c.accent2}; }
    .progress-bg {
      height: 6px;
      background: ${c.border};
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: ${playerPercent >= 100 ? c.accent2 : c.accent};
      border-radius: 3px;
      transition: width 0.3s ease;
      width: ${Math.min(playerPercent, 100)}%;
    }
    .widget-footer {
      display: flex;
      gap: 8px;
    }
    .btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-primary {
      background: ${c.accent};
      color: ${isDark ? '#0a0a0f' : '#ffffff'};
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: ${c.border};
      color: ${c.text};
    }
    .btn-secondary:hover {
      background: ${c.muted}33;
    }
    .server-meta {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: ${c.muted};
      margin-bottom: 12px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .votes-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: ${c.accent2}22;
      color: ${c.accent2};
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .gp-branding {
      text-align: center;
      font-size: 10px;
      color: ${c.muted};
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid ${c.border};
      opacity: 0.7;
    }
    .gp-branding a {
      color: ${c.accent};
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="widget">
    <div class="widget-header">
      <div class="server-icon">
        ${server.icon 
          ? `<img src="${server.icon}" alt="">`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`
        }
      </div>
      <div class="server-info">
        <h3 class="server-name">${escapeHtml(server.name)}</h3>
        <div class="server-status">
          <span class="status-dot"></span>
          <span>${isOnline ? 'Online' : 'Offline'}</span>
          ${server.vote_count > 0 ? `<span class="votes-badge">🗳️ ${server.vote_count.toLocaleString()}</span>` : ''}
        </div>
      </div>
    </div>
    
    ${s.showDescription && description ? `<p class="server-description">${escapeHtml(description)}</p>` : ''}
    
    ${s.showVersion ? `
    <div class="server-meta">
      <span class="meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>
        ${escapeHtml(server.version || 'Any')}
      </span>
      <span class="meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path></svg>
        ${server.ip}:${server.port}
      </span>
    </div>
    ` : ''}
    
    <div class="player-bar">
      <div class="player-label">
        <span>Players</span>
        <span class="player-count ${playerPercent >= 100 ? 'full' : isOnline ? 'online' : ''}">
          ${server.players_online?.toLocaleString() || 0} / ${server.max_players?.toLocaleString() || '?'}
        </span>
      </div>
      <div class="progress-bg">
        <div class="progress-fill"></div>
      </div>
    </div>
    
    <div class="widget-footer">
      <a href="${voteUrl}" target="_blank" class="btn btn-primary">Vote Now</a>
      <a href="${serverUrl}" target="_blank" class="btn btn-secondary">View Server</a>
    </div>
    
    <div class="gp-branding">
      Powered by <a href="${baseUrl}" target="_blank">GuildPost</a>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
