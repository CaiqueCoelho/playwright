import { type Page } from '@playwright/test';
import CartPage from './CartPage';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';

export class POManager {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly dashboardPage: DashboardPage;
  readonly cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.cartPage = new CartPage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getDashboardPage() {
    return this.dashboardPage;
  }

  getCartPage() {
    return this.cartPage;
  }
}
