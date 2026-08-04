import { useEffect, useState } from 'react';
import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils';
import { Button } from '@/shared/components';
import { ADD_TO_CART_FEEDBACK_MS, UI_TEXT } from '@/shared/constants/ui';

type AddStatus = 'idle' | 'loading' | 'success' | 'error';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void | Promise<void>;
}

const STATUS_LABELS: Record<AddStatus, string> = {
  idle: UI_TEXT.addToCart,
  loading: UI_TEXT.addingToCart,
  success: UI_TEXT.addedToCart,
  error: UI_TEXT.addToCartFailed,
};

const STATUS_CLASSES: Record<AddStatus, string> = {
  idle: '',
  loading: 'bg-gray-500 hover:bg-gray-500',
  success: 'bg-green-600 hover:bg-green-700',
  error: 'bg-red-600 hover:bg-red-700',
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [status, setStatus] = useState<AddStatus>('idle');

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    const t = setTimeout(() => setStatus('idle'), ADD_TO_CART_FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [status]);

  const handleClick = async () => {
    setStatus('loading');
    try {
      await onAddToCart(product);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const label = STATUS_LABELS[status];
  const btnClass = `mt-2 ${STATUS_CLASSES[status]}`.trim();

  return (
    <article
      data-testid="product-card"
      data-product-id={product.id}
      className="rounded-lg shadow-md p-4 bg-white flex flex-col gap-2"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-gray-700 font-medium">{formatPrice(product.price)}</p>
      <Button
        onClick={handleClick}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
        className={btnClass}
      >
        {label}
      </Button>
    </article>
  );
}
