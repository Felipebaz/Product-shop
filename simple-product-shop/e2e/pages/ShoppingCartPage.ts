import type { Locator, Page } from '@playwright/test';

export class ShoppingCartPage {
  readonly page: Page;
  readonly section: Locator;
  readonly heading: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.getByRole('region', { name: 'Shopping cart' });
    this.heading = this.section.getByRole('heading', { name: /shopping cart/i });
    this.emptyMessage = this.section.getByText(/your cart is empty/i);
    this.checkoutButton = this.section.getByRole('button', { name: /checkout/i });
    this.subtotal = this.section.getByTestId('cart-subtotal');
    this.total = this.section.getByTestId('cart-total');
  }

  getItem(productName: string): Locator {
    return this.section.getByTestId('cart-item').filter({
      has: this.page.getByRole('heading', { name: productName, level: 3 }),
    });
  }

  async increaseQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: /increase quantity/i })
      .click();
  }

  async decreaseQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: /decrease quantity/i })
      .click();
  }

  async removeItem(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: /remove item/i })
      .click();
  }

  async getQuantity(productName: string): Promise<number> {
    const text = await this.getItem(productName)
      .getByTestId('cart-item-quantity')
      .innerText();
    return Number(text.trim());
  }
}
