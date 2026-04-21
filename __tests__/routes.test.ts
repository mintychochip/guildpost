import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Cloudflare Routes Configuration', () => {
  it('should exclude /api/* from static routes so Cloudflare Functions handle them', () => {
    const routesPath = path.join(process.cwd(), 'public', '_routes.json');
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    
    // API routes are handled by Cloudflare Functions, not static file serving
    expect(routes.exclude).toEqual(['/api/*']);
  });

  it('should have correct include pattern', () => {
    const routesPath = path.join(process.cwd(), 'public', '_routes.json');
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    
    expect(routes.include).toContain('/*');
    expect(routes.version).toBe(1);
  });
});
