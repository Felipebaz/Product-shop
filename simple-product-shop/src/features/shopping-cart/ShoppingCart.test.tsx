import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CartItem, Product } from '@/shared/types';
import { CART_STORAGE_KEY } from '@/context/CartContextValue';
import { CartProvider } from '@/context/CartContext';
import { ShoppingCart } from '@/features/shopping-cart/ShoppingCart';

const product: Product = {
  id: 'headphones',
  name: 'Wireless Headphones',
  price: 50,
  image: '/img/headphones.png',
  description: 'Over-ear headphones.',
};

function seedCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function renderCart(): ReactNode {
  return render(
    <CartProvider>
      <ShoppingCart />
    </CartProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('ShoppingCart', () => {
  it('shows the empty state when there are no items', () => {
    renderCart();

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByTestId('cart-item')).not.toBeInTheDocument();
  });

  it('renders one row per cart item', () => {
    seedCart([{ product, quantity: 2 }]);
    renderCart();

    expect(screen.getAllByTestId('cart-item')).toHaveLength(1);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();
  });

  it('renders the summary with the order discount applied', () => {
    // 2 x $50 = $100 subtotal, which reaches the 15% order discount threshold
    seedCart([{ product, quantity: 2 }]);
    renderCart();

    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$100.00');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$85.00');
  });

  it('uses the singular badge label for a single item', () => {
    seedCart([{ product, quantity: 1 }]);
    renderCart();

    expect(screen.getByLabelText('1 item in cart')).toBeInTheDocument();
  });

  it('uses the plural badge label for several items', () => {
    seedCart([{ product, quantity: 3 }]);
    renderCart();

    expect(screen.getByLabelText('3 items in cart')).toBeInTheDocument();
  });

  it('announces the cart state in a polite live region', () => {
    seedCart([{ product, quantity: 2 }]);
    const { container } = render(
      <CartProvider>
        <ShoppingCart />
      </CartProvider>,
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toHaveTextContent('Cart updated: 2 items, total $85.00');
  });

  it('increases the quantity from the item row', async () => {
    seedCart([{ product, quantity: 1 }]);
    const user = userEvent.setup();
    renderCart();

    await user.click(
      screen.getByRole('button', { name: `Increase quantity of ${product.name}` }),
    );

    expect(screen.getByTestId('cart-item-quantity')).toHaveTextContent('2');
  });

  it('removes the item and falls back to the empty state', async () => {
    seedCart([{ product, quantity: 1 }]);
    const user = userEvent.setup();
    renderCart();

    await user.click(
      screen.getByRole('button', { name: `Remove ${product.name} from cart` }),
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
