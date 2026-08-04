import type { CartItem as CartItemType } from '@/shared/types';
import { formatPrice } from '@/shared/utils';
import { QUANTITY_LIMITS } from '@/shared/constants/businessRules';
import { UI_TEXT } from '@/shared/constants/ui';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;
  const canDecrease = quantity > QUANTITY_LIMITS.MIN;

  return (
    <li
      data-testid="cart-item"
      data-product-id={product.id}
      className="flex items-center gap-4 p-4 border-b bg-white"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={UI_TEXT.decreaseQuantity(product.name)}
          disabled={!canDecrease}
          onClick={() => onUpdateQuantity(quantity - 1)}
          className="w-8 h-8 rounded border disabled:opacity-40 hover:bg-gray-100"
        >
          −
        </button>
        <span
          aria-label={UI_TEXT.quantity}
          data-testid="cart-item-quantity"
          className="w-6 text-center"
        >
          {quantity}
        </span>
        <button
          type="button"
          aria-label={UI_TEXT.increaseQuantity(product.name)}
          onClick={() => onUpdateQuantity(quantity + 1)}
          className="w-8 h-8 rounded border hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <p className="w-20 text-right font-semibold">{formatPrice(lineTotal)}</p>
      <button
        type="button"
        aria-label={UI_TEXT.removeItem(product.name)}
        onClick={onRemove}
        className="text-red-600 hover:text-red-700 px-2"
      >
        ✕
      </button>
    </li>
  );
}
