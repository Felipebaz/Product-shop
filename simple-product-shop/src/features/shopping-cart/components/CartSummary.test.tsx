import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartSummary } from '@/features/shopping-cart/components/CartSummary';

describe('CartSummary', () => {
  it('renders the formatted subtotal', () => {
    render(<CartSummary subtotal={80} discount={0} total={75} itemCount={2} />);
    expect(screen.getByText('$80.00')).toBeInTheDocument();
  });

  it('renders the discount with a negative sign when > 0', () => {
    render(<CartSummary subtotal={100} discount={15} total={85} itemCount={5} />);
    expect(screen.getByText('-$15.00')).toBeInTheDocument();
  });

  it('does not render the discount line when discount is 0', () => {
    render(<CartSummary subtotal={80} discount={0} total={80} itemCount={2} />);
    expect(screen.queryByText(/discount/i)).not.toBeInTheDocument();
  });

  it('renders the formatted total', () => {
    render(<CartSummary subtotal={100} discount={15} total={85} itemCount={5} />);
    expect(screen.getByText('$85.00')).toBeInTheDocument();
  });

  it('shows a promo message with the missing amount when subtotal < 100', () => {
    render(<CartSummary subtotal={70} discount={0} total={70} itemCount={2} />);
    expect(screen.getByText(/add \$30\.00 more for 15% off/i)).toBeInTheDocument();
  });

  it('does not show the promo message when subtotal >= 100', () => {
    render(<CartSummary subtotal={100} discount={15} total={85} itemCount={5} />);
    expect(screen.queryByText(/more for 15% off/i)).not.toBeInTheDocument();
  });

  it('renders a checkout button', () => {
    render(<CartSummary subtotal={80} discount={0} total={80} itemCount={2} />);
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });
});
