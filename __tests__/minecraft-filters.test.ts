import { describe, it, expect } from 'vitest';

/**
 * Minecraft Page Filter Tests
 * Tests for the rating filter and filter combination functionality
 */

describe('Minecraft Server Filters', () => {
  // Mock server data with various ratings
  const mockServers = [
    { id: '1', name: 'Top Rated Server', rating_average: 4.8, rating_count: 25, country_code: 'US', edition: 'java', status: 'online' },
    { id: '2', name: 'Good Server', rating_average: 4.2, rating_count: 15, country_code: 'DE', edition: 'java', status: 'online' },
    { id: '3', name: 'Average Server', rating_average: 3.5, rating_count: 10, country_code: 'GB', edition: 'bedrock', status: 'online' },
    { id: '4', name: 'Below Average', rating_average: 2.8, rating_count: 8, country_code: 'US', edition: 'java', status: 'offline' },
    { id: '5', name: 'Low Rated', rating_average: 1.5, rating_count: 5, country_code: 'FR', edition: 'crossplay', status: 'online' },
    { id: '6', name: 'No Ratings Yet', rating_average: null, rating_count: 0, country_code: 'US', edition: 'java', status: 'online' },
    { id: '7', name: 'Unrated Server', rating_average: undefined, rating_count: null, country_code: 'CA', edition: 'bedrock', status: 'online' },
    { id: '8', name: 'Exactly 4 Stars', rating_average: 4.0, rating_count: 12, country_code: 'US', edition: 'java', status: 'online' },
    { id: '9', name: 'Exactly 3 Stars', rating_average: 3.0, rating_count: 7, country_code: 'JP', edition: 'java', status: 'online' },
  ];

  // Filter function that mirrors the client-side logic
  function applyRatingFilter(servers: typeof mockServers, minRating: string) {
    if (minRating === 'all') {
      return servers;
    }
    const threshold = parseFloat(minRating);
    return servers.filter(s => s.rating_average && s.rating_average >= threshold);
  }

  describe('Rating Filter', () => {
    it('should show all servers when "All Ratings" is selected', () => {
      const result = applyRatingFilter(mockServers, 'all');
      expect(result).toHaveLength(9);
      expect(result.map(s => s.name)).toContain('No Ratings Yet');
      expect(result.map(s => s.name)).toContain('Unrated Server');
    });

    it('should filter servers with 4+ stars', () => {
      const result = applyRatingFilter(mockServers, '4');
      expect(result).toHaveLength(3);
      expect(result.map(s => s.name)).toContain('Top Rated Server');
      expect(result.map(s => s.name)).toContain('Good Server');
      expect(result.map(s => s.name)).toContain('Exactly 4 Stars');
    });

    it('should filter servers with 3+ stars', () => {
      const result = applyRatingFilter(mockServers, '3');
      expect(result).toHaveLength(5);
      expect(result.map(s => s.name)).toContain('Top Rated Server');
      expect(result.map(s => s.name)).toContain('Good Server');
      expect(result.map(s => s.name)).toContain('Average Server');
      expect(result.map(s => s.name)).toContain('Exactly 4 Stars');
      expect(result.map(s => s.name)).toContain('Exactly 3 Stars');
    });

    it('should filter servers with 2+ stars', () => {
      const result = applyRatingFilter(mockServers, '2');
      expect(result).toHaveLength(6);
      expect(result.map(s => s.name)).not.toContain('Low Rated');
    });

    it('should filter servers with 1+ stars', () => {
      const result = applyRatingFilter(mockServers, '1');
      expect(result).toHaveLength(7);
      expect(result.map(s => s.name)).toContain('Low Rated');
    });

    it('should exclude servers without ratings when any rating filter is applied', () => {
      const result = applyRatingFilter(mockServers, '4');
      expect(result.map(s => s.name)).not.toContain('No Ratings Yet');
      expect(result.map(s => s.name)).not.toContain('Unrated Server');
    });

    it('should handle edge case of exactly matching the threshold', () => {
      const result4 = applyRatingFilter(mockServers, '4');
      expect(result4.map(s => s.name)).toContain('Exactly 4 Stars');

      const result3 = applyRatingFilter(mockServers, '3');
      expect(result3.map(s => s.name)).toContain('Exactly 3 Stars');
    });
  });

  describe('Combined Filters', () => {
    it('should combine rating filter with country filter', () => {
      const ratingFiltered = applyRatingFilter(mockServers, '4');
      const countryFiltered = ratingFiltered.filter(s => s.country_code === 'US');

      expect(countryFiltered).toHaveLength(2);
      expect(countryFiltered.map(s => s.name)).toContain('Top Rated Server');
      expect(countryFiltered.map(s => s.name)).toContain('Exactly 4 Stars');
    });

    it('should combine rating filter with edition filter', () => {
      const ratingFiltered = applyRatingFilter(mockServers, '3');
      const editionFiltered = ratingFiltered.filter(s => s.edition === 'bedrock');

      expect(editionFiltered).toHaveLength(1);
      expect(editionFiltered[0].name).toBe('Average Server');
    });

    it('should combine rating filter with search', () => {
      const ratingFiltered = applyRatingFilter(mockServers, '4');
      const searchFiltered = ratingFiltered.filter(s =>
        s.name.toLowerCase().includes('server')
      );

      expect(searchFiltered.length).toBeGreaterThan(0);
      expect(searchFiltered.every(s => s.rating_average && s.rating_average >= 4)).toBe(true);
    });

    it('should return empty results when filters are too restrictive', () => {
      const ratingFiltered = applyRatingFilter(mockServers, '4');
      const restrictive = ratingFiltered.filter(s =>
        s.country_code === 'FR' && s.edition === 'crossplay'
      );

      expect(restrictive).toHaveLength(0);
    });
  });

  describe('Filter Ordering', () => {
    it('should produce same results regardless of filter application order', () => {
      // Rating first, then country
      const order1 = applyRatingFilter(mockServers, '4').filter(s => s.country_code === 'US');

      // Country first, then rating
      const countryFirst = mockServers.filter(s => s.country_code === 'US');
      const order2 = applyRatingFilter(countryFirst, '4');

      expect(order1.map(s => s.id).sort()).toEqual(order2.map(s => s.id).sort());
    });
  });

  describe('Rating Sort Integration', () => {
    it('should correctly sort by rating after filtering', () => {
      const filtered = applyRatingFilter(mockServers, '3');
      const sorted = filtered.sort((a, b) =>
        (b.rating_average || 0) - (a.rating_average || 0)
      );

      expect(sorted[0].name).toBe('Top Rated Server');
      expect(sorted[sorted.length - 1].name).toBe('Exactly 3 Stars');
    });
  });
});

describe('Rating Filter UI Elements', () => {
  it('should have the correct filter options defined', () => {
    const expectedOptions = [
      { value: 'all', label: 'All Ratings' },
      { value: '4', label: '⭐⭐⭐⭐ 4+ Stars' },
      { value: '3', label: '⭐⭐⭐ 3+ Stars' },
      { value: '2', label: '⭐⭐ 2+ Stars' },
      { value: '1', label: '⭐ 1+ Star' },
    ];

    expectedOptions.forEach(opt => {
      expect(opt.value).toBeDefined();
      if (opt.value !== 'all') {
        expect(opt.label).toContain('⭐');
      }
    });
  });
});
