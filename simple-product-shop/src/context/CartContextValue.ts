import { createContext } from 'react';
import type { CartItem, Product } from '@/shared/types';

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export const CART_STORAGE_KEY = 'simple-product-shop:cart';
