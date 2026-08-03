import { CartProvider } from '@/context/CartContext';
import { useCart } from '@/context/useCart';
import { ProductCatalog } from '@/features/product-catalog/ProductCatalog';
import { ShoppingCart } from '@/features/shopping-cart/ShoppingCart';

function Header() {
  const { itemCount } = useCart();
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Simple Product Shop</h1>
        <div className="relative" aria-label="Cart">
          <span className="text-2xl" aria-hidden="true">🛒</span>
          {itemCount > 0 && (
            <span
              className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5"
              aria-label={`${itemCount} items in cart`}
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
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ProductCatalog onAddToCart={addItem} />
        <aside className="lg:sticky lg:top-24 h-fit">
          <ShoppingCart />
        </aside>
      </main>
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
