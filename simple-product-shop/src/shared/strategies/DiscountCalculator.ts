import type { CartItem } from '@/shared/types';
import type { DiscountStrategy } from './DiscountStrategy';

export interface DiscountBreakdownEntry {
  name: string;
  amount: number;
}

export class DiscountCalculator {
  private readonly strategies: DiscountStrategy[];

  constructor(strategies: DiscountStrategy[]) {
    this.strategies = strategies;
  }

  calculate(items: CartItem[], subtotal: number): number {
    if (items.length === 0) return 0;
    return this.getBreakdown(items, subtotal).reduce((sum, e) => sum + e.amount, 0);
  }

  getBreakdown(items: CartItem[], subtotal: number): DiscountBreakdownEntry[] {
    if (items.length === 0) return [];
    const breakdown: DiscountBreakdownEntry[] = [];
    let remaining = subtotal;
    for (const strategy of this.strategies) {
      if (!strategy.isApplicable(items, remaining)) continue;

      const amount = strategy.calculate(items, remaining);
      if (amount <= 0) continue;

      breakdown.push({ name: strategy.name, amount });
      remaining -= amount;
    }
    return breakdown;
  }
}
