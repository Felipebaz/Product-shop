export const UI_TEXT = {
  addToCart: 'Add to Cart',
  addingToCart: 'Adding...',
  addedToCart: 'Added!',
  addToCartFailed: 'Failed - retry',
  removeItem: (productName: string) => `Remove ${productName} from cart`,
  increaseQuantity: (productName: string) => `Increase quantity of ${productName}`,
  decreaseQuantity: (productName: string) => `Decrease quantity of ${productName}`,
  quantity: 'Quantity',
  checkout: 'Checkout',
  emptyCart: 'Your cart is empty',
  cartRegion: 'Shopping cart',
  cartHeading: 'Shopping Cart',
  cartBadgeLabel: (count: number) =>
    `${count} ${count === 1 ? 'item' : 'items'} in cart`,
  cartUpdate: (count: number, total: string) =>
    `Cart updated: ${count} ${count === 1 ? 'item' : 'items'}, total ${total}`,
} as const;

export const ADD_TO_CART_FEEDBACK_MS = 1500;
