// Simple Minecraft server ping implementation
// Uses the Minecraft Server List Ping protocol

interface PingResult {
  online: boolean;
  motd?: string;
  players?: number;
  maxPlayers?: number;
  version?: string;
  latency?: number;
}

export async function pingMinecraftServer(ip: string, port: number = 25565): Promise<PingResult> {
  // For Cloudflare Workers environment, we can't use Node.js sockets directly
  // Instead, we'll use a simple HTTP-based status check if available
  // or return a mock response for now
  
  // In a production environment, you would:
  // 1. Use a microservice that can do TCP sockets
  // 2. Use a third-party API like mcsrvstat.us
  // 3. Use WebSockets if available
  
  // For now, we'll try to use an external status API as a fallback
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    // Try using mcapi.us or similar free API
    const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { online: false };
    }
    
    const data = await response.json();
    
    if (!data.online) {
      return { online: false };
    }
    
    // Extract MOTD
    let motd = '';
    if (typeof data.motd === 'string') {
      motd = data.motd;
    } else if (data.motd?.clean) {
      motd = data.motd.clean;
    } else if (data.motd?.raw) {
      motd = data.motd.raw;
    }
    
    // Strip color codes
    motd = motd.replace(/§[0-9a-fk-or]/gi, '');
    
    return {
      online: true,
      motd: motd,
      players: data.players?.online || 0,
      maxPlayers: data.players?.max || 0,
      version: data.version || 'Unknown',
      latency: data.debug?.ping || undefined
    };
    
  } catch (err) {
    console.error('Minecraft ping error:', err);
    return { online: false };
  }
}

// Alternative: Use mcsrvstat.us API (more reliable)
export async function pingMinecraftServerAlt(ip: string, port: number = 25565): Promise<PingResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { online: false };
    }
    
    const data = await response.json();
    
    if (!data.online) {
      return { online: false };
    }
    
    // Extract MOTD - handle both string and object formats
    let motd = '';
    if (data.motd) {
      if (typeof data.motd === 'string') {
        motd = data.motd;
      } else if (Array.isArray(data.motd?.clean)) {
        motd = data.motd.clean.join('\n');
      } else if (typeof data.motd?.clean === 'string') {
        motd = data.motd.clean;
      } else if (Array.isArray(data.motd?.raw)) {
        motd = data.motd.raw.join('\n');
      } else if (typeof data.motd?.raw === 'string') {
        motd = data.motd.raw;
      }
    }
    
    // Strip Minecraft color codes and formatting
    motd = motd
      .replace(/§[0-9a-fk-or]/gi, '')  // Standard color codes
      .replace(/\u00a7[0-9a-fk-or]/gi, '')  // Unicode color codes
      .replace(/\x1b\[[0-9;]*m/g, '')  // ANSI escape codes
      .trim();
    
    return {
      online: true,
      motd: motd,
      players: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 0,
      version: data.version || 'Unknown',
      latency: data.debug?.ping ?? undefined
    };
    
  } catch (err) {
    console.error('Minecraft ping error:', err);
    return { online: false };
  }
}
