const { test, expect } = require('@playwright/test');

test('UI Controles', async ({ page }) => {
  const username = page.locator('#username');
  const password = page.locator("[type='password']");
  const signin = page.locator('#signInBtn');
  const dropdown = page.locator('select.form-control');
  const checkUser = page.locator('.radiotextsty').last();
  const okButton = page.locator('#okayBtn');
  const documentLink = page.locator("[href*='documents-request']");

  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  await username.fill('caiquecoelho');
  await password.fill('learning');
  await dropdown.selectOption('consult');
  await checkUser.click();
  await okButton.click();
  await expect(checkUser).toBeChecked();
  console.log(await checkUser.isChecked());
  await page.locator('#terms').click();
  await expect(page.locator('#terms')).toBeChecked();
  await page.locator('#terms').uncheck();
  expect(await page.locator('#terms').isChecked()).toBeFalsy();
  // assertion

  //await page.pause(); // debug option
  // await signin.click();
  await expect(documentLink).toHaveAttribute('class', 'blinkingText');
});
