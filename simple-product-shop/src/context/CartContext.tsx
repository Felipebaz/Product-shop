import { useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import type { CartItem, Product } from '@/shared/types';
import { calculateSubtotal } from '@/shared/utils';
import {
  BulkDiscountStrategy,
  DiscountCalculator,
  OrderDiscountStrategy,
} from '@/shared/strategies';
import {
  CART_STORAGE_KEY,
  CartContext,
  type CartContextValue,
} from './CartContextValue';

const discountCalculator = new DiscountCalculator([
  new BulkDiscountStrategy(),
  new OrderDiscountStrategy(),
]);

function trackCartAction(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({ category: 'cart', message, level: 'info', data });
}

type Action =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.product.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...state, { product: action.product, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.product.id !== action.productId);
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return state.filter((i) => i.product.id !== action.productId);
      }
      return state.map((i) =>
        i.product.id === action.productId ? { ...i, quantity: action.quantity } : i,
      );
    case 'CLEAR_CART':
      return [];
  }
}

function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitial);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = calculateSubtotal(items);
    const discountBreakdown = discountCalculator.getBreakdown(items, subtotal);
    const discount = discountBreakdown.reduce((s, e) => s + e.amount, 0);
    return {
      items,
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      discount,
      total: subtotal - discount,
      discountBreakdown,
      addItem: (product) => {
        trackCartAction(`Added ${product.name} to cart`, {
          productId: product.id,
          productName: product.name,
        });
        dispatch({ type: 'ADD_ITEM', product });
      },
      removeItem: (productId) => {
        trackCartAction(`Removed item ${productId} from cart`, { productId });
        dispatch({ type: 'REMOVE_ITEM', productId });
      },
      updateQuantity: (productId, quantity) => {
        trackCartAction(`Updated ${productId} quantity to ${quantity}`, {
          productId,
          quantity,
        });
        dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
      },
      clearCart: () => {
        trackCartAction('Cleared cart');
        dispatch({ type: 'CLEAR_CART' });
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
