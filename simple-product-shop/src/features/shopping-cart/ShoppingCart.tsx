import { useCart } from '@/context/useCart';
import { formatPrice } from '@/shared/utils';
import { UI_TEXT } from '@/shared/constants/ui';
import { CartItem, CartSummary } from './components';

export function ShoppingCart() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    discountBreakdown,
    updateQuantity,
    removeItem,
  } = useCart();
  const isEmpty = items.length === 0;

  return (
    <section className="flex flex-col gap-4" aria-label={UI_TEXT.cartRegion}>
      <h2 className="text-xl font-semibold flex items-center gap-2">
        {UI_TEXT.cartHeading}
        <span
          className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5"
          aria-label={UI_TEXT.cartBadgeLabel(itemCount)}
        >
          {itemCount}
        </span>
      </h2>

      <p className="sr-only" aria-live="polite">
        {UI_TEXT.cartUpdate(itemCount, formatPrice(total))}
      </p>

      {isEmpty ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <p className="text-4xl mb-2" aria-hidden="true">🛒</p>
          <p>{UI_TEXT.emptyCart}</p>
        </div>
      ) : (
        <>
          <ul className="bg-white rounded-lg shadow overflow-hidden">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={(q) => updateQuantity(item.product.id, q)}
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
          </ul>
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            total={total}
            itemCount={itemCount}
            discountBreakdown={discountBreakdown}
          />
        </>
      )}
    </section>
  );
}
