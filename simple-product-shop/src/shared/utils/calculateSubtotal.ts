import type { CartItem } from '@/shared/types';

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
}
