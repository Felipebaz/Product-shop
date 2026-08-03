import { ProductCatalog } from '@/features/product-catalog/ProductCatalog';
import type { Product } from '@/shared/types';

function App() {
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Simple Product Shop</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <ProductCatalog onAddToCart={handleAddToCart} />
      </main>
    </div>
  );
}

export default App;
