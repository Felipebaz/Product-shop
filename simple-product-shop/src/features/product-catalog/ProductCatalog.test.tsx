import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Product } from '../../shared/types';

const mockProducts: Product[] = [
  {
    id: 'a',
    name: 'Alpha Widget',
    price: 10,
    image: '/img/a.png',
    description: 'First test product.',
  },
  {
    id: 'b',
    name: 'Beta Gadget',
    price: 20,
    image: '/img/b.png',
    description: 'Second test product.',
  },
];

vi.mock('../../shared/data/products', () => ({
  products: mockProducts,
}));

import { ProductCatalog } from './ProductCatalog';

describe('ProductCatalog', () => {
  it('renders the "Products" heading', () => {
    render(<ProductCatalog onAddToCart={() => {}} />);
    expect(
      screen.getByRole('heading', { name: /products/i }),
    ).toBeInTheDocument();
  });

  it('renders one ProductCard per product', () => {
    render(<ProductCatalog onAddToCart={() => {}} />);
    expect(screen.getByText('Alpha Widget')).toBeInTheDocument();
    expect(screen.getByText('Beta Gadget')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add to cart/i })).toHaveLength(2);
  });

  it('passes onAddToCart down to each ProductCard', async () => {
    const onAddToCart = vi.fn();
    render(<ProductCatalog onAddToCart={onAddToCart} />);
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    await userEvent.click(buttons[0]);
    expect(onAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});
