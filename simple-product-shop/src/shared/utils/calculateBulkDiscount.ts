import type { CartItem } from '@/shared/types';
import { BULK_DISCOUNT } from '@/shared/constants/businessRules';

export function calculateBulkDiscount(items: CartItem[]): number {
  return items.reduce((total, { product, quantity }) => {
    if (quantity >= BULK_DISCOUNT.MIN_QUANTITY) {
      return total + product.price * quantity * BULK_DISCOUNT.RATE;
    }
    return total;
  }, 0);
}
