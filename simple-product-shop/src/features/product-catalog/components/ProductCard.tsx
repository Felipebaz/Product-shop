import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils';
import { Button } from '@/shared/components';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
      <Button onClick={() => onAddToCart(product)} className="mt-2">
        Add to Cart
      </Button>
    </article>
  );
}
