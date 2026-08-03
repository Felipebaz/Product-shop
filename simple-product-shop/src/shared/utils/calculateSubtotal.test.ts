import { describe, it, expect } from 'vitest';
import type { CartItem, Product } from '@/shared/types';
import { calculateSubtotal } from './calculateSubtotal';

const makeProduct = (price: number, id = 'p'): Product => ({
  id,
  name: 'Test',
  price,
  image: '',
  description: '',
});

const item = (price: number, quantity: number, id?: string): CartItem => ({
  product: makeProduct(price, id),
  quantity,
});

describe('calculateSubtotal', () => {
  it('returns 0 for an empty array', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('returns price × quantity for a single item', () => {
    expect(calculateSubtotal([item(10, 3)])).toBe(30);
  });

  it('sums price × quantity across multiple items', () => {
    expect(
      calculateSubtotal([item(10, 2, 'a'), item(5.5, 4, 'b'), item(100, 1, 'c')]),
    ).toBe(10 * 2 + 5.5 * 4 + 100 * 1);
  });
});
