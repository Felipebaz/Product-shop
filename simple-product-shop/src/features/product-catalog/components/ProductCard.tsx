import { useEffect, useState } from 'react';
import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils';
import { Button } from '@/shared/components';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [status, setStatus] = useState<'idle' | 'added'>('idle');

  useEffect(() => {
    if (status !== 'added') return;
    const t = setTimeout(() => setStatus('idle'), 1500);
    return () => clearTimeout(t);
  }, [status]);

  const handleClick = () => {
    onAddToCart(product);
    setStatus('added');
  };

  const label = status === 'added' ? 'Added!' : 'Add to Cart';
  const btnClass =
    status === 'added' ? 'mt-2 bg-green-600 hover:bg-green-700' : 'mt-2';

  return (
    <article className="rounded-lg shadow-md p-4 bg-white flex flex-col gap-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-gray-700 font-medium">{formatPrice(product.price)}</p>
      <Button onClick={handleClick} className={btnClass}>
        {label}
      </Button>
    </article>
  );
}
