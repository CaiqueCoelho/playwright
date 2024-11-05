// Login just once via UI and store session information in .json and inject this data on the next tests

import test, { expect } from '@playwright/test';
import { APIUtils } from '../../utils/utils';
import { request } from 'http';
let webContext;

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

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  const email = 'caiquedpfc@gmail.com';

  const username = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const loginBtn = page.locator('#login');
  await username.fill(email);
  await password.fill('$7DHhQP@PhiK8N');
  await loginBtn.click();
  await page.waitForLoadState('networkidle');
  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('@API Login via UI and store session', async () => {
  const email = 'caiquedpfc@gmail.com';
  const page = await webContext.newPage();
  await page.goto('https://rahulshettyacademy.com/client');
  const products = page.locator('.card-body');
  const productNameToBuy = 'ZARA COAT 3';

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

test('@API Login via UI and store session 2', async () => {
  const page = await webContext.newPage();
  await page.goto('https://rahulshettyacademy.com/client');

  const productNameToBuy = 'ZARA COAT 3';

  // wait until the newtwork calls has finished
  // await page.waitForLoadState('networkidle');
  // wait until the element is visible
  await page.locator('.card-body b').first().waitFor();

  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);

  await expect(page.locator('.card-body b').first()).toContainText(
    productNameToBuy
  );
});
