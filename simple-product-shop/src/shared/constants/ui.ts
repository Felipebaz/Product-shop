export const UI_TEXT = {
  addToCart: 'Add to Cart',
  addedToCart: 'Added!',
  removeItem: 'Remove item',
  increaseQuantity: 'Increase quantity',
  decreaseQuantity: 'Decrease quantity',
  quantity: 'Quantity',
  checkout: 'Checkout',
  emptyCart: 'Your cart is empty',
  cartRegion: 'Shopping cart',
  cartHeading: 'Shopping Cart',
  cartBadgeLabel: (count: number) => `${count} items in cart`,
} as const;

export const ADD_TO_CART_FEEDBACK_MS = 1500;
