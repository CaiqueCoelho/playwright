const { test, request, expect, Page } = require('@playwright/test');
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

const fakePayloadOrders = { data: [], message: 'No Orders' };

let token;
let orderId;
let apiUtils;

test.beforeAll(async ({}) => {
  apiUtils = new APIUtils(await request.newContext(), loginPayload);
  const response = await apiUtils.createOrder(orderPayload);
  token = response.token;
  orderId = response.orderId;
});

test('Place order by API and see on the UI if the order is on Order history', async ({
  page,
}) => {
  // const { orderId, token } = await apiUtils.createOrder(orderPayload);
  page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);

  await page.goto('https://rahulshettyacademy.com/client');

  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    async (route) => {
      // const response = await page.request.fetch(route.request());
      const response = await route.fetch();
      const json = await response.json();
      json.data = [];

      // options to mock the response
      //   await route.fulfill({
      //     response,
      //     json,
      //   });

      // OR
      //   const body = JSON.stringify(fakePayloadOrders);
      //   console.log(response);
      //   await route.fulfill({
      //     response,
      //     body,
      //   });

      // OR
      //   const body = JSON.stringify(fakePayloadOrders);
      //   await route.fulfill({
      //     status: 200,
      //     contentType: 'application/json',
      //     body: body,
      //   });

      // OR
      route.fulfill({ path: 'tests/mock_data.json' });
    }
  );
  await page.locator('button[routerlink*="myorders"]').click();
  await page.waitForResponse(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*'
  );
  await expect(page).toHaveURL(/myorders/);

  await expect(
    page.getByText('You have No Orders to show at this time.')
  ).toBeVisible();
});

test('Aborting a request to get the css or images(jpg,png,jpeg) and also logging the request response status', async ({
  page,
}) => {
  page.route('**/*.{css,jpg,png,jpeg}', (route) => route.abort());
  // Listen for the request calls
  page.on('request', (request) => console.log(request.url()));
  page.on('response', (response) =>
    console.log(response.url(), response.status())
  );
  await page.goto('https://rahulshettyacademy.com/client');
  const email = 'caiquedpfc@gmail.com';

  const username = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const loginBtn = page.locator('#login');

  await username.fill(email);
  await password.fill('$7DHhQP@PhiK8N');
  await loginBtn.click();

  // wait until the newtwork calls has finished
  // await page.waitForLoadState('networkidle');
  // wait until the element is visible
  await page.locator('.card-body b').first().waitFor();

  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);
});

async function getFulfilledResponse(page) {

  return page.waitForResponse(async (res) => {
    if(!res.url().includes('/api/ecom/order/get-orders-for-customer/')) {
      return false
    }

    const responseBody = await res.json();
    return responseBody.data.length > 0
  })
}

test('Intercept orders API', async ({
  page,
}) => {
  const responsePromise = getFulfilledResponse(page)
  page.route('**/*.{css,jpg,png,jpeg}', (route) => route.abort());
  // Listen for the request calls
  page.on('request', (request) => console.log(request.url()));
  page.on('response', (response) =>
    console.log(response.url(), response.status())
  );
  await page.goto('https://rahulshettyacademy.com/client');
  const email = 'caiquedpfc@gmail.com';

  const username = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const loginBtn = page.locator('#login');

  await username.fill(email);
  await password.fill('$7DHhQP@PhiK8N');
  await loginBtn.click();

  // wait until the newtwork calls has finished
  // await page.waitForLoadState('networkidle');
  // wait until the element is visible
  await page.locator('.card-body b').first().waitFor();

  const titles = await page.locator('.card-body b').allTextContents();
  console.log(titles);

  page.locator('[routerlink="/dashboard/myorders"]').click()
  const response = await responsePromise
  const responseBody = await response.json();
  console.log(responseBody);
  expect(responseBody.data).toBeTruthy();
  await expect(page.getByRole("rowheader", { name: responseBody.data[0]._id})).toBeVisible();
});
