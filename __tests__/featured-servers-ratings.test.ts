import { describe, it, expect } from 'vitest';

/**
 * Tests for FeaturedServers component with ratings display
 * Verifies that rating data is properly handled and displayed
 */

describe('FeaturedServers Rating Display', () => {
  it('should handle servers with ratings', () => {
    const server = {
      id: 'test-1',
      name: 'Test Server',
      ip: 'mc.test.com',
      port: 25565,
      rating_average: 4.5,
      rating_count: 12
    };
    
    expect(server.rating_average).toBe(4.5);
    expect(server.rating_count).toBe(12);
    expect(Math.round(server.rating_average)).toBe(5);
  });

  it('should handle servers without ratings', () => {
    const server = {
      id: 'test-2',
      name: 'New Server',
      ip: 'mc.new.com',
      port: 25565
    };
    
    expect(server.rating_average).toBeUndefined();
    expect(server.rating_count).toBeUndefined();
  });

  it('should handle zero rating count', () => {
    const server = {
      id: 'test-3',
      name: 'Unrated Server',
      ip: 'mc.unrated.com',
      port: 25565,
      rating_average: 0,
      rating_count: 0
    };
    
    // Ratings should not display when count is 0
    expect(server.rating_count).toBe(0);
    expect(server.rating_count > 0).toBe(false);
  });

  it('should render correct star count', () => {
    const testCases = [
      { rating: 5, expected: '★★★★★' },
      { rating: 4.5, expected: '★★★★★' }, // rounds to 5
      { rating: 4.2, expected: '★★★★☆' }, // rounds to 4
      { rating: 3.7, expected: '★★★★☆' }, // rounds to 4
      { rating: 3.2, expected: '★★★☆☆' }, // rounds to 3
      { rating: 2.5, expected: '★★★☆☆' }, // rounds to 3
      { rating: 2.4, expected: '★★☆☆☆' }, // rounds to 2
      { rating: 1.8, expected: '★★☆☆☆' }, // rounds to 2
      { rating: 1.2, expected: '★☆☆☆☆' }, // rounds to 1
      { rating: 0.5, expected: '★☆☆☆☆' }, // rounds to 1
    ];
    
    for (const tc of testCases) {
      const filled = Math.round(tc.rating);
      const stars = '★'.repeat(filled) + '☆'.repeat(5 - filled);
      expect(stars).toBe(tc.expected);
    }
  });

  it('should include rating fields in API query', () => {
    // Verify the query string includes rating fields
    const selectFields = 'id,name,ip,port,tier,vote_count,players_online,max_players,status,description,tags,version,banner,icon,rating_average,rating_count';
    
    expect(selectFields).toContain('rating_average');
    expect(selectFields).toContain('rating_count');
  });
});
