import { describe, it, expect } from 'vitest';
import type { CartItem, Product } from '@/shared/types';
import { BULK_DISCOUNT } from '@/shared/constants/businessRules';
import { calculateBulkDiscount } from './calculateBulkDiscount';

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

describe('calculateBulkDiscount', () => {
  it('returns 0 when no item reaches the minimum quantity', () => {
    expect(
      calculateBulkDiscount([
        item(10, BULK_DISCOUNT.MIN_QUANTITY - 1, 'a'),
        item(20, 1, 'b'),
      ]),
    ).toBe(0);
  });

  it('applies the rate when an item is exactly at the minimum quantity', () => {
    const price = 10;
    const qty = BULK_DISCOUNT.MIN_QUANTITY;
    expect(calculateBulkDiscount([item(price, qty)])).toBe(
      price * qty * BULK_DISCOUNT.RATE,
    );
  });

  it('applies the rate when an item exceeds the minimum quantity', () => {
    const price = 20;
    const qty = BULK_DISCOUNT.MIN_QUANTITY + 3;
    expect(calculateBulkDiscount([item(price, qty)])).toBe(
      price * qty * BULK_DISCOUNT.RATE,
    );
  });

  it('discounts only the items that qualify', () => {
    const qualifying = item(10, BULK_DISCOUNT.MIN_QUANTITY, 'a');
    const notQualifying = item(50, BULK_DISCOUNT.MIN_QUANTITY - 1, 'b');
    const expected =
      qualifying.product.price * qualifying.quantity * BULK_DISCOUNT.RATE;
    expect(calculateBulkDiscount([qualifying, notQualifying])).toBe(expected);
  });
});
