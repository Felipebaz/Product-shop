import type { CartItem } from '@/shared/types';
import { BULK_DISCOUNT } from '@/shared/constants/businessRules';
import type { DiscountStrategy } from './DiscountStrategy';

export class BulkDiscountStrategy implements DiscountStrategy {
  readonly name = 'Bulk Discount';
  readonly description = `${Math.round(BULK_DISCOUNT.RATE * 100)}% off on ${BULK_DISCOUNT.MIN_QUANTITY}+ units of the same item`;

  isApplicable(items: CartItem[]): boolean {
    return items.some((i) => i.quantity >= BULK_DISCOUNT.MIN_QUANTITY);
  }

  calculate(items: CartItem[]): number {
    return items.reduce((total, { product, quantity }) => {
      if (quantity >= BULK_DISCOUNT.MIN_QUANTITY) {
        return total + product.price * quantity * BULK_DISCOUNT.RATE;
      }
      return total;
    }, 0);
  }
}
