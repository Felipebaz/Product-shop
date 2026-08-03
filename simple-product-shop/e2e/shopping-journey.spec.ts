import { test, expect } from '@playwright/test';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { ShoppingCartPage } from './pages/ShoppingCartPage';

const PRODUCT = 'Wireless Headphones';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test.describe('Shopping journey', () => {
  test('cart is empty initially', async ({ page }) => {
    const cart = new ShoppingCartPage(page);
    await expect(cart.emptyMessage).toBeVisible();
  });

  test('adding a product shows it in the cart', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    await catalog.addToCart(PRODUCT);

    await expect(cart.getItem(PRODUCT)).toBeVisible();
    expect(await cart.getQuantity(PRODUCT)).toBe(1);
  });

  test('adding the same product increments quantity', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    await catalog.addToCart(PRODUCT);
    await catalog.addToCart(PRODUCT);
    await catalog.addToCart(PRODUCT);

    expect(await cart.getQuantity(PRODUCT)).toBe(3);
  });

  test('+/- buttons update quantity', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    await catalog.addToCart(PRODUCT);
    await cart.increaseQuantity(PRODUCT);
    await cart.increaseQuantity(PRODUCT);
    expect(await cart.getQuantity(PRODUCT)).toBe(3);

    await cart.decreaseQuantity(PRODUCT);
    expect(await cart.getQuantity(PRODUCT)).toBe(2);
  });

  test('remove button deletes the item', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    await catalog.addToCart(PRODUCT);
    await expect(cart.getItem(PRODUCT)).toBeVisible();

    await cart.removeItem(PRODUCT);
    await expect(cart.getItem(PRODUCT)).toHaveCount(0);
    await expect(cart.emptyMessage).toBeVisible();
  });

  test('bulk discount appears with 5+ units of same item', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    for (let i = 0; i < 5; i++) {
      await catalog.addToCart(PRODUCT);
    }

    expect(await cart.getQuantity(PRODUCT)).toBe(5);
    await expect(cart.section.getByText(/bulk discount/i)).toBeVisible();
  });

  test('cart persists after page refresh (localStorage)', async ({ page }) => {
    const catalog = new ProductCatalogPage(page);
    const cart = new ShoppingCartPage(page);

    await catalog.addToCart(PRODUCT);
    await catalog.addToCart(PRODUCT);
    expect(await cart.getQuantity(PRODUCT)).toBe(2);

    await page.reload();

    await expect(cart.getItem(PRODUCT)).toBeVisible();
    expect(await cart.getQuantity(PRODUCT)).toBe(2);
  });
});
