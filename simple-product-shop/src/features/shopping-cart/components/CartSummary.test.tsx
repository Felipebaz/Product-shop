import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DiscountBreakdownEntry } from '@/shared/strategies';
import { CartSummary } from '@/features/shopping-cart/components/CartSummary';

describe('CartSummary', () => {
  it('renders the formatted subtotal', () => {
    render(
      <CartSummary
        subtotal={80}
        discount={0}
        total={75}
        itemCount={2}
        discountBreakdown={[]}
      />,
    );
    expect(screen.getByText('$80.00')).toBeInTheDocument();
  });

  it('renders each discount from the breakdown with a negative sign', () => {
    const breakdown: DiscountBreakdownEntry[] = [
      { name: 'Bulk Discount', amount: 12.5 },
      { name: 'Order Discount', amount: 16.88 },
    ];
    render(
      <CartSummary
        subtotal={125}
        discount={29.38}
        total={95.62}
        itemCount={5}
        discountBreakdown={breakdown}
      />,
    );
    expect(screen.getByText('Bulk Discount')).toBeInTheDocument();
    expect(screen.getByText('-$12.50')).toBeInTheDocument();
    expect(screen.getByText('Order Discount')).toBeInTheDocument();
    expect(screen.getByText('-$16.88')).toBeInTheDocument();
  });

  it('does not render a discount section when breakdown is empty', () => {
    render(
      <CartSummary
        subtotal={80}
        discount={0}
        total={80}
        itemCount={2}
        discountBreakdown={[]}
      />,
    );
    expect(screen.queryByText(/discount/i)).not.toBeInTheDocument();
  });

  it('renders the formatted total', () => {
    render(
      <CartSummary
        subtotal={100}
        discount={15}
        total={85}
        itemCount={5}
        discountBreakdown={[{ name: 'Order Discount', amount: 15 }]}
      />,
    );
    expect(screen.getByText('$85.00')).toBeInTheDocument();
  });

  it('shows a promo message with the missing amount when subtotal < 100', () => {
    render(
      <CartSummary
        subtotal={70}
        discount={0}
        total={70}
        itemCount={2}
        discountBreakdown={[]}
      />,
    );
    expect(screen.getByText(/add \$30\.00 more for 15% off/i)).toBeInTheDocument();
  });

  it('does not show the promo message when subtotal >= 100', () => {
    render(
      <CartSummary
        subtotal={100}
        discount={15}
        total={85}
        itemCount={5}
        discountBreakdown={[{ name: 'Order Discount', amount: 15 }]}
      />,
    );
    expect(screen.queryByText(/more for 15% off/i)).not.toBeInTheDocument();
  });

  it('renders a checkout button', () => {
    render(
      <CartSummary
        subtotal={80}
        discount={0}
        total={80}
        itemCount={2}
        discountBreakdown={[]}
      />,
    );
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });
});
