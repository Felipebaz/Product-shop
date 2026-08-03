import type { Product } from '@/shared/types';
import { products } from '@/shared/data/products';
import { ProductCard } from '@/features/product-catalog/components/ProductCard';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
