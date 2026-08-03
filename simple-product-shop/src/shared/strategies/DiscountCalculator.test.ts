import { describe, it, expect } from 'vitest';
import type { CartItem, Product } from '@/shared/types';
import {
  BULK_DISCOUNT,
  ORDER_DISCOUNT,
} from '@/shared/constants/businessRules';
import { BulkDiscountStrategy } from './BulkDiscountStrategy';
import { OrderDiscountStrategy } from './OrderDiscountStrategy';
import { DiscountCalculator } from './DiscountCalculator';

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

const subtotalOf = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.product.price * i.quantity, 0);

const makeSut = () =>
  new DiscountCalculator([new BulkDiscountStrategy(), new OrderDiscountStrategy()]);

describe('DiscountCalculator', () => {
  it('returns 0 for an empty cart', () => {
    const sut = makeSut();
    expect(sut.calculate([], 0)).toBe(0);
    expect(sut.getBreakdown([], 0)).toEqual([]);
  });

  it('applies only the bulk discount when subtotal < order minimum', () => {
    const items = [item(10, BULK_DISCOUNT.MIN_QUANTITY, 'a')];
    const subtotal = subtotalOf(items);
    const expected = subtotal * BULK_DISCOUNT.RATE;
    const sut = makeSut();
    expect(sut.calculate(items, subtotal)).toBeCloseTo(expected);
    const breakdown = sut.getBreakdown(items, subtotal);
    expect(breakdown).toHaveLength(1);
    expect(breakdown[0].name).toBe('Bulk Discount');
  });

  it('applies only the order discount when no item qualifies for bulk', () => {
    const items = [item(60, 2, 'a')];
    const subtotal = subtotalOf(items);
    const expected = subtotal * ORDER_DISCOUNT.RATE;
    const sut = makeSut();
    expect(sut.calculate(items, subtotal)).toBeCloseTo(expected);
    const breakdown = sut.getBreakdown(items, subtotal);
    expect(breakdown).toHaveLength(1);
    expect(breakdown[0].name).toBe('Order Discount');
  });

  it('applies both discounts sequentially', () => {
    const items = [item(25, BULK_DISCOUNT.MIN_QUANTITY, 'a')];
    const subtotal = subtotalOf(items);
    const bulk = subtotal * BULK_DISCOUNT.RATE;
    const remaining = subtotal - bulk;
    const order = remaining * ORDER_DISCOUNT.RATE;
    const sut = makeSut();
    expect(sut.calculate(items, subtotal)).toBeCloseTo(bulk + order);
  });

  it('getBreakdown returns each applied discount with its name and amount', () => {
    const items = [item(25, BULK_DISCOUNT.MIN_QUANTITY, 'a')];
    const subtotal = subtotalOf(items);
    const bulk = subtotal * BULK_DISCOUNT.RATE;
    const remaining = subtotal - bulk;
    const order = remaining * ORDER_DISCOUNT.RATE;
    const sut = makeSut();

    const breakdown = sut.getBreakdown(items, subtotal);
    expect(breakdown).toHaveLength(2);
    expect(breakdown[0]).toEqual({ name: 'Bulk Discount', amount: bulk });
    expect(breakdown[1].name).toBe('Order Discount');
    expect(breakdown[1].amount).toBeCloseTo(order);
  });
});
