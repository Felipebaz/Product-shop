import { formatPrice } from '@/shared/utils';
import { Button } from '@/shared/components';
import { ORDER_DISCOUNT } from '@/shared/constants/businessRules';
import type { DiscountBreakdownEntry } from '@/shared/strategies';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  discountBreakdown: DiscountBreakdownEntry[];
}

export function CartSummary({
  subtotal,
  total,
  itemCount,
  discountBreakdown,
}: CartSummaryProps) {
  const showPromo = subtotal < ORDER_DISCOUNT.MIN_SUBTOTAL;
  const missing = ORDER_DISCOUNT.MIN_SUBTOTAL - subtotal;
  const promoPct = Math.round(ORDER_DISCOUNT.RATE * 100);

  return (
    <aside className="bg-gray-50 rounded-lg p-6 flex flex-col gap-3">
      <h3 className="text-lg font-semibold">
        Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h3>

      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {discountBreakdown.map((entry) => (
        <div
          key={entry.name}
          className="flex justify-between text-green-700 text-sm"
        >
          <span>{entry.name}</span>
          <span>-{formatPrice(entry.amount)}</span>
        </div>
      ))}

      <hr className="border-gray-200" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {showPromo && (
        <p className="text-sm text-purple-700 bg-purple-50 rounded px-3 py-2">
          Add {formatPrice(missing)} more for {promoPct}% off!
        </p>
      )}

      <Button className="w-full mt-2">Checkout</Button>
    </aside>
  );
}
