import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Product } from '@/shared/types';
import { ProductCard } from '@/features/product-catalog/components/ProductCard';

const product: Product = {
  id: 'p-1',
  name: 'Wireless Headphones',
  price: 59.9,
  image: '/img/headphones.png',
  description: 'Noise-cancelling over-ear headphones with 30h battery.',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('formats price as $XX.XX', () => {
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    expect(screen.getByText('$59.90')).toBeInTheDocument();
  });

  it('renders product image with alt text', () => {
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    const img = screen.getByRole('img', { name: /wireless headphones/i });
    expect(img).toHaveAttribute('src', '/img/headphones.png');
  });

  it('renders product description', () => {
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it('calls onAddToCart with the product when button clicked', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
