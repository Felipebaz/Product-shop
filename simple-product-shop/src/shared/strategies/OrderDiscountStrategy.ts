import type { CartItem } from '@/shared/types';
import { ORDER_DISCOUNT } from '@/shared/constants/businessRules';
import type { DiscountStrategy } from './DiscountStrategy';

export class OrderDiscountStrategy implements DiscountStrategy {
  readonly name = 'Order Discount';
  readonly description = `${Math.round(ORDER_DISCOUNT.RATE * 100)}% off on orders of $${ORDER_DISCOUNT.MIN_SUBTOTAL}+`;

  isApplicable(_items: CartItem[], subtotal: number): boolean {
    return subtotal >= ORDER_DISCOUNT.MIN_SUBTOTAL;
  }

  calculate(_items: CartItem[], subtotal: number): number {
    return subtotal * ORDER_DISCOUNT.RATE;
  }
}
