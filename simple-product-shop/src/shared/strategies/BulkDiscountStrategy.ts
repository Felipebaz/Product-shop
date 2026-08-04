import type { CartItem } from '@/shared/types';
import { BULK_DISCOUNT } from '@/shared/constants/businessRules';
import { calculateBulkDiscount } from '@/shared/utils';
import type { DiscountStrategy } from './DiscountStrategy';

export class BulkDiscountStrategy implements DiscountStrategy {
  readonly name = 'Bulk Discount';
  readonly description = `${Math.round(BULK_DISCOUNT.RATE * 100)}% off on ${BULK_DISCOUNT.MIN_QUANTITY}+ units of the same item`;

  isApplicable(items: CartItem[]): boolean {
    return items.some((i) => i.quantity >= BULK_DISCOUNT.MIN_QUANTITY);
  }

  calculate(items: CartItem[]): number {
    return calculateBulkDiscount(items);
  }
}
