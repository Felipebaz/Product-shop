import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats an integer with two decimals', () => {
    expect(formatPrice(10)).toBe('$10.00');
  });

  it('formats a decimal with two decimals', () => {
    expect(formatPrice(59.9)).toBe('$59.90');
  });

  it('rounds to two decimals', () => {
    expect(formatPrice(1.235)).toBe('$1.24');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('uses thousand separators for large numbers', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50');
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });
});
