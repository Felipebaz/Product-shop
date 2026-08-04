import { useCallback, useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { useCart } from '@/context/useCart';
import { ProductCatalog } from '@/features/product-catalog/ProductCatalog';
import { ShoppingCart } from '@/features/shopping-cart/ShoppingCart';
import { LoginDemo } from '@/features/auth/LoginDemo';
import { Toast } from '@/shared/components';
import type { Product } from '@/shared/types';
import { UI_TEXT } from '@/shared/constants/ui';

// An error boundary only catches throws during render. A throw inside onClick
// escapes to window.onerror, so flip state and throw on the next render instead.
function TestErrorButton() {
  const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error('Test error from React');
  }

  return (
    <button
      type="button"
      onClick={() => setCrash(true)}
      className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
    >
      Test Error
    </button>
  );
}

function Header() {
  const { itemCount } = useCart();
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Simple Product Shop</h1>
        {import.meta.env.DEV && <TestErrorButton />}
        <div className="relative" aria-label="Cart">
          <span className="text-2xl" aria-hidden="true">🛒</span>
          {itemCount > 0 && (
            <span
              className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5"
              aria-label={UI_TEXT.cartBadgeLabel(itemCount)}
            >
              {itemCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function Shell() {
  const { addItem } = useCart();
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
      setToast(`${product.name} added to cart`);
    },
    [addItem],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ProductCatalog onAddToCart={handleAddToCart} />
        <aside className="lg:sticky lg:top-24 h-fit flex flex-col gap-4">
          <ShoppingCart />
          <details className="rounded-lg bg-white shadow">
            <summary className="cursor-pointer px-4 py-3 font-medium">
              Login demo
            </summary>
            <div className="border-t">
              <LoginDemo />
            </div>
          </details>
        </aside>
      </main>

      {toast && (
        <div className="fixed bottom-4 right-4 z-20 max-w-sm">
          <Toast message={toast} onClose={dismissToast} />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}

export default App;
