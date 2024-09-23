import { expect, type Page, type Locator } from '@playwright/test';

export default class CartPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly cartProducts: Locator;
  readonly checkoutButton: Locator;
  readonly countryOptions: Locator;
  readonly clientEmailInput: Locator;
  readonly submitButton: Locator;
  readonly countryInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('[routerlink*="cart"]');
    this.cartProducts = page.locator('div li');
    this.checkoutButton = page.locator('text=Checkout');
    this.countryOptions = page.locator('.ta-results');
    this.clientEmailInput = page.locator("label[type='text']");
    this.submitButton = page.locator('.action__submit');
    this.countryInput = page.locator("[placeholder*='Country']");
  }

  async checkIfProductIsInCart(productNameToBuy: string) {
    await expect(this.getProductTitleInCart(productNameToBuy)).toBeVisible();
    const isProductNameToBuyOnCart = await this.getProductTitleInCart(
      productNameToBuy
    ).isVisible();
    expect(isProductNameToBuyOnCart).toBeTruthy();
  }

  getProductTitleInCart(productNameToBuy: string) {
    return this.page.locator(`h3:has-text("${productNameToBuy}")`);
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async doCheckout(countryPress: string, country: string, email: string) {
    await this.countryInput.pressSequentially(countryPress);

    const options = this.countryOptions;
    await options.waitFor();
    const countryToSelect = this.returnCountryOption(options, country);
    await countryToSelect.click();

    await this.clientEmailInput.first().waitFor();
    await expect(this.clientEmailInput.first()).toHaveText(email);
    await this.submitButton.click();
  }

  returnCountryOption(options: Locator, country: string) {
    return options.locator(`text=${country}`);
  }
}
