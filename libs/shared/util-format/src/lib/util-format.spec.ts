import { formatCount, formatPrice, formatRating } from './util-format';

describe('util-format', () => {
  describe('formatPrice', () => {
    it('formats USD by default', () => {
      expect(formatPrice(12.5)).toBe('$12.50');
    });

    it('respects a different currency', () => {
      expect(formatPrice(10, 'EUR', 'en-US')).toBe('€10.00');
    });
  });

  describe('formatRating', () => {
    it('renders one decimal and a star', () => {
      expect(formatRating(4.25)).toBe('4.3 ★');
    });
  });

  describe('formatCount', () => {
    it('passes through small counts', () => {
      expect(formatCount(950)).toBe('950');
    });

    it('compacts thousands', () => {
      expect(formatCount(1500)).toBe('1.5k');
    });
  });
});
