import { type Page, type Locator } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly username: Locator;
  readonly password: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('#login');
    this.username = page.locator('#userEmail');
    this.password = page.locator('#userPassword');
  }

  async doLogin(email: string, password: string) {
    await this.username.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goTo() {
    await this.page.goto('https://rahulshettyacademy.com/client');
  }
}

export default LoginPage;
