import { ProductCatalog } from '@/features/product-catalog/ProductCatalog';
import { CartItem, CartSummary } from '@/features/shopping-cart/components';
import type { CartItem as CartItemType, Product } from '@/shared/types';

const previewItem: CartItemType = {
  product: {
    id: 'preview',
    name: 'Wireless Headphones',
    price: 59.9,
    image: 'https://picsum.photos/seed/headphones/200',
    description: 'Preview item.',
  },
  quantity: 2,
};

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

      <main className="mx-auto max-w-6xl px-6 py-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ProductCatalog onAddToCart={handleAddToCart} />

        <div className="flex flex-col gap-4">
          <ul className="bg-white rounded-lg shadow">
            <CartItem
              item={previewItem}
              onUpdateQuantity={(q) => console.log('qty', q)}
              onRemove={() => console.log('remove')}
            />
          </ul>
          <CartSummary subtotal={119.8} discount={0} total={119.8} itemCount={2} />
        </div>
      </main>
    </div>
  );
}

export default App;
