import { describe, it, expect } from 'vitest';
import { ORDER_DISCOUNT } from '@/shared/constants/businessRules';
import { OrderDiscountStrategy } from './OrderDiscountStrategy';

const sut = new OrderDiscountStrategy();

describe('OrderDiscountStrategy', () => {
  it('has the correct name', () => {
    expect(sut.name).toBe('Order Discount');
  });

  it('is NOT applicable when subtotal is below the minimum', () => {
    expect(sut.isApplicable([], ORDER_DISCOUNT.MIN_SUBTOTAL - 0.01)).toBe(false);
  });

  it('IS applicable when subtotal reaches the minimum', () => {
    expect(sut.isApplicable([], ORDER_DISCOUNT.MIN_SUBTOTAL)).toBe(true);
  });

  it('calculates the configured rate over the given subtotal', () => {
    const subtotal = 200;
    expect(sut.calculate([], subtotal)).toBe(subtotal * ORDER_DISCOUNT.RATE);
  });
});
