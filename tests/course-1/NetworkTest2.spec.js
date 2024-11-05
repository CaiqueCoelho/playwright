import test, { expect, request } from '@playwright/test';
import APIUtils from '../../utils/utils';

let token;
let orderId;

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

test.beforeAll(async ({}) => {
  const apiUtils = new APIUtils(await request.newContext(), loginPayload);
  const response = await apiUtils.createOrder(orderPayload);
  token = response.token;
  orderId = response.orderId;
});

test('Security Test request intercept', async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto('https://rahulshettyacademy.com/client');

  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
    async (route) => {
      route.continue({
        url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=66849bc0ae2afd4c0b14d8f3',
      });
    }
  );

  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForResponse(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*'
  );
  await expect(page).toHaveURL(/myorders/);

  // await page.locator('button:has-text("View")').nth(0).click();
  await page.getByRole('button', { name: 'View' }).nth(0).click();
  await page.getByText('You are not authorize to view this order').isVisible();
});
