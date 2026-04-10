import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Cloudflare Routes Configuration', () => {
  it('should exclude /api/** for dynamic routing', () => {
    const routesPath = path.join(process.cwd(), 'public', '_routes.json');
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    
    // API routes must be excluded from static serving so Astro SSR handles them
    const hasApiExclude = routes.exclude?.some((pattern: string) => 
      pattern === '/api/**' || pattern.startsWith('/api/')
    );
    
    expect(hasApiExclude).toBe(true);
  });

  it('should have correct include pattern and api exclude', () => {
    const routesPath = path.join(process.cwd(), 'public', '_routes.json');
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    
    expect(routes.include).toContain('/*');
    expect(routes.version).toBe(1);
    expect(routes.exclude).toContain('/api/**');
  });
});
