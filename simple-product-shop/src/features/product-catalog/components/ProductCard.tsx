interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const price = `$${product.price.toFixed(2)}`;

  return (
    <article className="rounded-lg shadow-md p-4 bg-white flex flex-col gap-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-700">{price}</p>
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </article>
  );
}
