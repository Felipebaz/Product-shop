import type { CartItem } from '@/shared/types';

export interface DiscountStrategy {
  readonly name: string;
  readonly description: string;
  isApplicable(items: CartItem[], subtotal: number): boolean;
  calculate(items: CartItem[], subtotal: number): number;
}
