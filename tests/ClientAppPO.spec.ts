import { test, expect } from '@playwright/test';
import { customTest } from '../utils/test-base';
import { POManager } from '../Pages/POManager';
const dataset = JSON.parse(
  JSON.stringify(require('../utils/placeOrderTestData.json'))
);

dataset.forEach((data, index) => {
  test(`@Web Log in with ${data.email} and find the product ${data.productName} - interaction: ${index}`, async ({
    page,
  }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();

    await loginPage.goTo();
    await loginPage.doLogin(data.email, data.password);

    await page.waitForURL(/dashboard/);
    // wait until the newtwork calls has finished
    // await page.waitForLoadState('networkidle');
    // wait until the element is visible
    const productIndexToBuy = await dashboardPage.searchProduct(
      data.productName
    );
    await dashboardPage.addProductToCart(productIndexToBuy);

    dashboardPage.goToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.cartProducts.first().waitFor();

    await cartPage.checkIfProductIsInCart(data.productName);

    await cartPage.goToCheckout();
    await cartPage.doCheckout('Bra', 'Brazil', data.email);

    await expect(page.locator('.hero-primary')).toHaveText(
      ' Thankyou for the order. '
    );
    let orderId: any;
    orderId = await page
      .locator('.em-spacer-1 .ng-star-inserted')
      .textContent();
    orderId = orderId.replaceAll('|', '').trim();
    console.log('orderId:', orderId);

    await page.locator('button[routerlink*="myorders"]').click();
    await expect(page).toHaveURL(/myorders/);

    await page.locator('tbody').waitFor();
    await page.locator(`text=${orderId}`).waitFor();
    await expect(page.locator(`text=${orderId}`)).toBeVisible();
    await page
      .locator(`text=${orderId}`)
      .locator('..')
      .locator('button')
      .first()
      .click();
    await expect(page).toHaveURL(/order-details/);
    const orderIdDetailsPage = await page.locator('.col-text').textContent();
    expect(orderIdDetailsPage).toContain(orderId);
  });
});

customTest(
  'Place order by using customTest',
  async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();

    await loginPage.goTo();
    await loginPage.doLogin(testDataForOrder.email, testDataForOrder.password);

    // wait until the newtwork calls has finished
    // await page.waitForLoadState('networkidle');
    // wait until the element is visible
    const productIndexToBuy = await dashboardPage.searchProduct(
      testDataForOrder.productName
    );
    await dashboardPage.addProductToCart(productIndexToBuy);

    dashboardPage.goToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.cartProducts.first().waitFor();

    await cartPage.checkIfProductIsInCart(testDataForOrder.productName);

    await cartPage.goToCheckout();
    await cartPage.doCheckout('Bra', 'Brazil', testDataForOrder.email);

    await expect(page.locator('.hero-primary')).toHaveText(
      ' Thankyou for the order. '
    );
    let orderId: any = await page
      .locator('.em-spacer-1 .ng-star-inserted')
      .textContent();
    orderId = orderId.replaceAll('|', '').trim();
    console.log('orderId:', orderId);

    await page.locator('button[routerlink*="myorders"]').click();
    await expect(page).toHaveURL(/myorders/);

    await page.locator('tbody').waitFor();
    await page.locator(`text=${orderId}`).waitFor();
    await expect(page.locator(`text=${orderId}`)).toBeVisible();
    await page
      .locator(`text=${orderId}`)
      .locator('..')
      .locator('button')
      .first()
      .click();
    await expect(page).toHaveURL(/order-details/);
    const orderIdDetailsPage = await page.locator('.col-text').textContent();
    expect(orderIdDetailsPage).toContain(orderId);
  }
);
