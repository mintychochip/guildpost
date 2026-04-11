import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Reviews API Route', () => {
  it('should have the reviews API route file', () => {
    const reviewsApiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'reviews.ts');
    expect(fs.existsSync(reviewsApiPath)).toBe(true);
  });

  it('should export POST handler', () => {
    const reviewsApiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'reviews.ts');
    const content = fs.readFileSync(reviewsApiPath, 'utf-8');
    expect(content).toContain('export const POST');
  });

  it('should export GET handler', () => {
    const reviewsApiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'reviews.ts');
    const content = fs.readFileSync(reviewsApiPath, 'utf-8');
    expect(content).toContain('export const GET');
  });

  it('should proxy to Supabase Edge Function', () => {
    const reviewsApiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'reviews.ts');
    const content = fs.readFileSync(reviewsApiPath, 'utf-8');
    expect(content).toContain('functions/v1/reviews');
  });

  it('should handle serverId param correctly', () => {
    const reviewsApiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'reviews.ts');
    const content = fs.readFileSync(reviewsApiPath, 'utf-8');
    expect(content).toContain('{ params');
    expect(content).toContain('const { id } = params');
  });
});

describe('Reviews Component Integration', () => {
  it('should have Reviews component', () => {
    const reviewsComponentPath = path.join(process.cwd(), 'src', 'components', 'Reviews.astro');
    expect(fs.existsSync(reviewsComponentPath)).toBe(true);
  });

  it('should call correct API endpoint', () => {
    const reviewsComponentPath = path.join(process.cwd(), 'src', 'components', 'Reviews.astro');
    const content = fs.readFileSync(reviewsComponentPath, 'utf-8');
    expect(content).toContain('/api/servers/${serverId}/reviews');
  });
});
