import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Product } from '@/shared/types';
import { BULK_DISCOUNT, ORDER_DISCOUNT } from '@/shared/constants/businessRules';
import { CartProvider } from '@/context/CartContext';
import { useCart } from '@/context/useCart';

const productA: Product = {
  id: 'a',
  name: 'A',
  price: 10,
  image: '',
  description: '',
};
const productB: Product = {
  id: 'b',
  name: 'B',
  price: 25,
  image: '',
  description: '',
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('addItem adds a new product with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(productA));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('a');
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('addItem increments quantity for an existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productA);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('updateQuantity changes the quantity of an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.updateQuantity('a', 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('updateQuantity with 0 removes the item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.updateQuantity('a', 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('removeItem removes an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productB);
      result.current.removeItem('a');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('b');
  });

  it('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productB);
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('itemCount sums all quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productA);
      result.current.addItem(productB);
    });
    expect(result.current.itemCount).toBe(3);
  });

  it('subtotal sums price × quantity for each item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productA);
      result.current.addItem(productB);
    });
    expect(result.current.subtotal).toBe(10 * 2 + 25 * 1);
  });

  it('exposes discount, total, and empty breakdown when no rule applies', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(productA));
    expect(result.current.discount).toBe(0);
    expect(result.current.total).toBe(result.current.subtotal);
    expect(result.current.discountBreakdown).toEqual([]);
  });

  it('applies bulk discount in the computed values', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      for (let i = 0; i < BULK_DISCOUNT.MIN_QUANTITY; i++) {
        result.current.addItem(productA);
      }
    });
    const subtotal = productA.price * BULK_DISCOUNT.MIN_QUANTITY;
    expect(result.current.subtotal).toBe(subtotal);
    expect(result.current.discount).toBeCloseTo(subtotal * BULK_DISCOUNT.RATE);
    expect(result.current.discountBreakdown[0].name).toBe('Bulk Discount');
  });

  it('stacks bulk and order discounts sequentially', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const highPrice: Product = { ...productA, price: 25 };
    act(() => {
      for (let i = 0; i < BULK_DISCOUNT.MIN_QUANTITY; i++) {
        result.current.addItem(highPrice);
      }
    });
    const subtotal = 25 * BULK_DISCOUNT.MIN_QUANTITY;
    const bulk = subtotal * BULK_DISCOUNT.RATE;
    const order = (subtotal - bulk) * ORDER_DISCOUNT.RATE;
    expect(result.current.discount).toBeCloseTo(bulk + order);
    expect(result.current.total).toBeCloseTo(subtotal - bulk - order);
    expect(result.current.discountBreakdown.map((e) => e.name)).toEqual([
      'Bulk Discount',
      'Order Discount',
    ]);
  });

  it('persists state to localStorage and rehydrates on remount', () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(productA);
      result.current.addItem(productA);
    });
    unmount();

    const { result: result2 } = renderHook(() => useCart(), { wrapper });
    expect(result2.current.items).toHaveLength(1);
    expect(result2.current.items[0].quantity).toBe(2);
  });
});
