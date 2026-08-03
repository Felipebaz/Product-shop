import { ProductCard } from './features/product-catalog/components/ProductCard';
import type { Product } from './shared/types';

const sampleProduct: Product = {
  id: 'p-1',
  name: 'Wireless Headphones',
  price: 59.9,
  image: 'https://picsum.photos/seed/headphones/400/300',
  description: 'Noise-cancelling over-ear headphones with 30h battery.',
};

function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <ProductCard
          product={sampleProduct}
          onAddToCart={(p) => console.log('Add to cart:', p)}
        />
      </div>
    </main>
  );
}

export default App;
