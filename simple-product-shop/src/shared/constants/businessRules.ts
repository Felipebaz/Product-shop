export const BULK_DISCOUNT = {
  MIN_QUANTITY: 5,
  RATE: 0.1,
} as const;

export const ORDER_DISCOUNT = {
  MIN_SUBTOTAL: 100,
  RATE: 0.15,
} as const;

export const QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 99,
} as const;
