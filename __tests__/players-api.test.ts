import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Player Analytics API', () => {
  const apiPath = path.join(process.cwd(), 'src', 'pages', 'api', 'servers', '[id]', 'players.ts');

  it('should have the players API route file', () => {
    expect(fs.existsSync(apiPath)).toBe(true);
  });

  it('should export GET handler', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('export const GET');
  });

  it('should export OPTIONS handler for CORS', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('export const OPTIONS');
  });

  it('should parse hours parameter with default of 24', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toMatch(/hours.*\|\|.*24/);
    expect(content).toContain('parseInt');
  });

  it('should query server_ping_history table', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('server_ping_history');
    expect(content).toContain('players_online');
  });

  it('should filter by online status only', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('status=eq.online');
  });

  it('should aggregate data by hour', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('hourlyData');
    expect(content).toContain('slice(0, 13)'); // Hour grouping
  });

  it('should calculate avg, max, and min players per hour', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('avg_players');
    expect(content).toContain('max_players');
    expect(content).toContain('min_players');
  });

  it('should calculate trend vs previous period', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('prevStartTime');
    expect(content).toContain('trend_percent');
    expect(content).toContain('prevAvg');
  });

  it('should return CORS headers', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('Access-Control-Allow-Origin');
    expect(content).toContain('*');
  });

  it('should handle missing Supabase configuration', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('missing key');
    expect(content).toContain('500');
  });

  it('should include sample_count in response', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('sample_count');
  });

  it('should handle null players_online values', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('!== null');
    expect(content).toContain('filter');
  });

  it('should return proper error response on failure', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('catch (err)');
    expect(content).toContain('error');
    expect(content).toMatch(/status.*500/);
  });

  it('should include generated_at timestamp', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('generated_at');
    expect(content).toContain('toISOString');
  });

  it('should match votes.ts API structure for consistency', () => {
    const content = fs.readFileSync(apiPath, 'utf-8');
    expect(content).toContain('server_id: id');
    expect(content).toContain('period:');
    expect(content).toContain('chart_data');
  });
});
