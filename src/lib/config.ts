// Centralized configuration - keys loaded from environment
// For Cloudflare Pages, use import.meta.env
// For local dev, these fall back to the values if env vars not set

export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// For server-side API routes
export function getServerConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL || SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

// Client-side Supabase key (safe to expose - this is the anon key)
// For client-side rendering, we need the anon key in the browser
// This is the PUBLIC/ANON key - it's designed to be exposed
export const SUPABASE_PUBLIC_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
