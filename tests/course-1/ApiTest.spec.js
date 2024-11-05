const { test, request, expect } = require('@playwright/test');
const { default: APIUtils } = require('../../utils/utils');

const orderPayload = {
  orders: [
    {
      country: 'Brazil',
      productOrderedId: '6581ca979fd99c85e8ee7faf',
    },
  ],
};

const loginPayload = {
  userEmail: 'caiquedpfc@gmail.com',
  userPassword: '$7DHhQP@PhiK8N',
};

let token;
let orderId;
let apiUtils;

test.beforeAll(async ({}) => {
  apiUtils = new APIUtils(await request.newContext(), loginPayload);
  const response = await apiUtils.createOrder(orderPayload);
  token = response.token;
  orderId = response.orderId;
});

test('@API Place an order with login by API flow', async ({ page }) => {
  const email = 'caiquedpfc@gmail.com';
  const products = page.locator('.card-body');
  const productNameToBuy = 'ZARA COAT 3';

  const apiUtils = new APIUtils(await request.newContext(), loginPayload);
  const token = await apiUtils.getToken();
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto('https://rahulshettyacademy.com/client');

  // wait until the newtwork calls has finished
  // await page.waitForLoadState('networkidle');
  // wait until the element is visible
  await page.locator('.card-body b').first().waitFor();

  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);

  await expect(page.locator('.card-body b').first()).toContainText(
    productNameToBuy
  );

  const productsCount = await products.count();
  console.log(productsCount);
  for (let productIndex = 0; productIndex < productsCount; productIndex++) {
    if (
      (await products.nth(productIndex).locator('b').textContent()) ===
      productNameToBuy
    ) {
      console.log('We find the product');
      await products.nth(productIndex).locator('text= Add To Cart').click();
      break;
    } else {
      console.log("We didn't find the product");
    }
  }

  await page.locator('[routerlink*="cart"]').click();
  await page.locator('div li').first().waitFor();
  expect(page.locator(`h3:has-text("${productNameToBuy}")`)).toBeVisible();
  const isProductNameToBuyOnCart = page
    .locator(`h3:has-text("${productNameToBuy}")`)
    .isVisible();
  expect(isProductNameToBuyOnCart).toBeTruthy();

  await page.locator('text=Checkout').click();
  await page.locator("[placeholder*='Country']").pressSequentially('Bra');

  const options = page.locator('.ta-results');
  await options.waitFor();
  await options.locator('text=Brazil').click();

  await page.locator("label[type='text']").first().waitFor();
  await expect(page.locator("label[type='text']").first()).toHaveText(email);
  await page.locator('.action__submit').click();

  await expect(page.locator('.hero-primary')).toHaveText(
    ' Thankyou for the order. '
  );
  let orderId = await page
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

test('@API Place order by API and see on the UI if the order is on Order history', async ({
  page,
}) => {
  // const { orderId, token } = await apiUtils.createOrder(orderPayload);
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto('https://rahulshettyacademy.com/client');

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
