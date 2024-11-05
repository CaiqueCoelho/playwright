const { test, expect } = require('@playwright/test');

// parallel in specific file
// mode: 'serial' -> If the first test fails, the second test will not run
// or if first test pass, and the second test fails, the third test will not run
test.describe.configure({
  mode: 'parallel',
});
test('Browser context declaration', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = page.locator('#username');
  const signin = page.locator('#signInBtn');
  const cardTitles = page.locator('.card-body a');

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  await username.fill('caiquecoelho');
  await page.locator("[type='password']").fill('learning');
  await signin.click();
  console.log(await page.locator('[style*="block"]').textContent());
  await expect(page.locator('[style*="block"]')).toContainText(
    'Incorrect username/password.'
  );
  await username.fill('');
  await username.fill('rahulshettyacademy');
  await signin.click();

  await expect(page.locator('.card-body a').first()).toContainText('iphone X');
  await expect(page.locator('.card-body a').nth(0)).toContainText('iphone X');

  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test('Browser context default with page', async ({ page }) => {
  await page.goto('https://google.com/');
  console.log(await page.title());
  await expect(page).toHaveTitle('Google');
});

test('@Web Log in and find the first product name', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/client');
  const email = 'caiquedpfc@gmail.com';

  const username = page.locator('#userEmail');
  const password = page.locator('#userPassword');
  const loginBtn = page.locator('#login');
  const products = page.locator('.card-body');
  const productNameToBuy = 'ZARA COAT 3';

  await username.fill(email);
  await password.fill('$7DHhQP@PhiK8N');
  await loginBtn.click();

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

test('GetByLabel example', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/angularpractice/');
  await page.getByLabel('Check me out if you Love IceCreams!').check();
  await page.getByLabel('Employed').check();
  await page.getByLabel('Gender').selectOption('Male');

  await page.getByPlaceholder('Password').fill('12345');
  await page.locator('[name="email"]').fill('caique.coelho@gmail.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page
    .getByText('Success! The Form has been submitted successfully!.')
    .isVisible();

  await page.getByRole('link', { name: 'Shop' }).click();
  await expect(page).toHaveURL(/shop/);
  await page
    .locator('app-card')
    .filter({ hasText: 'Blackberry' })
    .getByRole('button', { name: 'Add' })
    .click();
});

test('@Web testing calendar', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

  const monthNumber = 6;
  const date = '15';
  const year = '2027';
  const expectedList = [String(monthNumber), date, year];

  await page.locator('.react-date-picker__inputGroup').click();
  await page.locator('.react-calendar__navigation__label').click();
  await page.locator('.react-calendar__navigation__label').click();
  await page.getByText(year).click();
  await page
    .locator('.react-calendar__year-view__months__month')
    .nth(monthNumber - 1)
    .click();

  await page.locator('//abbr[text()=' + date + ']').click();
  const inputs = await page.locator('.react-date-picker__inputGroup input');
  for (let index = 0; index < inputs.length; index++) {
    const value = await inputs[index].getAttribute('value');
    expect(value).toEqual(1);
  }
});

test('Validating if test is visible or hidden', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();
});

test('Validating javascript alerts/popup/dialog', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  page.on('dialog', (dialog) => dialog.accept());
  // page.on('dialog', dialog => dialog.dismiss());
  await page.locator('#confirmbtn').click();
});

test('Hover function', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await page.hover('#mousehover');
  await page.locator('#mousehover').hover();
  await expect(page.locator('.mouse-hover-content')).toBeVisible();
  await page.locator('[href="#top"]').click();
  await expect(page).toHaveURL(
    'https://rahulshettyacademy.com/AutomationPractice/#top'
  );
});

test('Child windows handles / New page / New tab', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = page.locator('#username');
  const documentLink = page.locator("[href*='documents-request']");
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
  ]); // wait promises to be resolved

  const text = await newPage.locator('.red').textContent();
  console.log(text);
  const arrayText = text.split('@');
  const domain = arrayText[1].split(' ')[0];
  console.log(domain);
  await username.fill(domain);
  await page.pause();
});

test('Handling iframe', async ({ page }) => {
  page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  const framePage = page.frameLocator('#courses-iframe');
  await framePage.locator('li a[href*="lifetime-access"]:visible').click();
  const textCheck = await framePage.locator('.text h2').textContent();
  const subscribers = textCheck.split(' ')[1];
  console.log(subscribers);
  await expect(
    framePage.getByText(`Join ${subscribers} Happy Subscibers!`)
  ).toBeVisible();
});
