import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CartItem as CartItemType } from '@/shared/types';
import { CartItem } from '@/features/shopping-cart/components/CartItem';

const makeItem = (quantity: number): CartItemType => ({
  product: {
    id: 'p-1',
    name: 'Wireless Headphones',
    price: 59.9,
    image: '/img/headphones.png',
    description: 'Great sound.',
  },
  quantity,
});

describe('CartItem', () => {
  it('renders product name and unit price', () => {
    render(
      <CartItem item={makeItem(2)} onUpdateQuantity={() => {}} onRemove={() => {}} />,
    );
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$59.90')).toBeInTheDocument();
  });

  it('renders the current quantity', () => {
    render(
      <CartItem item={makeItem(3)} onUpdateQuantity={() => {}} onRemove={() => {}} />,
    );
    expect(screen.getByLabelText('Quantity')).toHaveTextContent('3');
  });

  it('renders the line subtotal', () => {
    render(
      <CartItem item={makeItem(2)} onUpdateQuantity={() => {}} onRemove={() => {}} />,
    );
    expect(screen.getByText('$119.80')).toBeInTheDocument();
  });

  it('calls onUpdateQuantity with quantity + 1 when + is clicked', async () => {
    const onUpdate = vi.fn();
    render(
      <CartItem item={makeItem(2)} onUpdateQuantity={onUpdate} onRemove={() => {}} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /increase quantity/i }));
    expect(onUpdate).toHaveBeenCalledWith(3);
  });

  it('calls onUpdateQuantity with quantity - 1 when - is clicked', async () => {
    const onUpdate = vi.fn();
    render(
      <CartItem item={makeItem(3)} onUpdateQuantity={onUpdate} onRemove={() => {}} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /decrease quantity/i }));
    expect(onUpdate).toHaveBeenCalledWith(2);
  });

  it('disables the - button when quantity is 1', () => {
    render(
      <CartItem item={makeItem(1)} onUpdateQuantity={() => {}} onRemove={() => {}} />,
    );
    expect(
      screen.getByRole('button', { name: /decrease quantity/i }),
    ).toBeDisabled();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(
      <CartItem item={makeItem(2)} onUpdateQuantity={() => {}} onRemove={onRemove} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
