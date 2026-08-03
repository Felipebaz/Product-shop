import { describe, it, expect } from 'vitest';
import type { CartItem, Product } from '@/shared/types';
import { BULK_DISCOUNT } from '@/shared/constants/businessRules';
import { BulkDiscountStrategy } from './BulkDiscountStrategy';

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

const sut = new BulkDiscountStrategy();

describe('BulkDiscountStrategy', () => {
  it('has the correct name', () => {
    expect(sut.name).toBe('Bulk Discount');
  });

  it('is NOT applicable when no item reaches the minimum quantity', () => {
    const items = [item(10, BULK_DISCOUNT.MIN_QUANTITY - 1, 'a'), item(20, 1, 'b')];
    expect(sut.isApplicable(items, 50)).toBe(false);
  });

  it('IS applicable when some item reaches the minimum quantity', () => {
    const items = [item(10, BULK_DISCOUNT.MIN_QUANTITY, 'a')];
    expect(sut.isApplicable(items, 50)).toBe(true);
  });

  it('calculates 10% of the qualifying items subtotal', () => {
    const price = 10;
    const qty = BULK_DISCOUNT.MIN_QUANTITY;
    const items = [item(price, qty)];
    expect(sut.calculate(items, price * qty)).toBe(price * qty * BULK_DISCOUNT.RATE);
  });

  it('discounts only qualifying items when multiple items exist', () => {
    const qualifying = item(10, BULK_DISCOUNT.MIN_QUANTITY, 'a');
    const notQualifying = item(50, BULK_DISCOUNT.MIN_QUANTITY - 1, 'b');
    const items = [qualifying, notQualifying];
    const subtotal = 10 * BULK_DISCOUNT.MIN_QUANTITY + 50 * (BULK_DISCOUNT.MIN_QUANTITY - 1);
    const expected = 10 * BULK_DISCOUNT.MIN_QUANTITY * BULK_DISCOUNT.RATE;
    expect(sut.calculate(items, subtotal)).toBe(expected);
  });
});
