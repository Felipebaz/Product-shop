import type { Locator, Page } from '@playwright/test';

export class ProductCatalogPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Products' });
    this.productCards = page.getByTestId('product-card');
  }

  async goto() {
    await this.page.goto('/');
  }

  getProduct(name: string): Locator {
    return this.productCards.filter({
      has: this.page.getByRole('heading', { name, level: 3 }),
    });
  }

  async addToCart(name: string) {
    const card = this.getProduct(name);
    await card.getByRole('button', { name: /add to cart/i }).click();
  }
}
