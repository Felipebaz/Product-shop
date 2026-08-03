import { useCart } from '@/context/useCart';
import { CartItem, CartSummary } from './components';

export function ShoppingCart() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const isEmpty = items.length === 0;

  return (
    <section className="flex flex-col gap-4" aria-label="Shopping cart">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Shopping Cart
        <span
          className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount}
        </span>
      </h2>

      {isEmpty ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <p className="text-4xl mb-2" aria-hidden="true">🛒</p>
          <p>Your cart is empty</p>
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
            discount={0}
            total={subtotal}
            itemCount={itemCount}
          />
        </>
      )}
    </section>
  );
}
