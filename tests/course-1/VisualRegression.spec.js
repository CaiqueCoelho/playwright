import test, { expect } from '@playwright/test';

test('Taking screenshots full and partial', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  // take partial screenshot of just the locator
  await page
    .locator('#displayed-text')
    .screenshot({ path: 'screeenshots/textbox-input-locator.png' });
  await page.locator('#hide-textbox').click();
  // take a screenshot for the entire page
  await page.screenshot({ path: 'screeenshots/hide-textbox.png' });
  await expect(page.locator('#displayed-text')).toBeHidden();
});

test('Snapshot test to pass', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();
  // Check if current snapshot is the same as the previous
  expect(await page.screenshot()).toMatchSnapshot('hide-textbox.png');
});

test('Snapshot test to fail', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  // Check if current snapshot is the same as the previous
  expect(await page.screenshot()).toMatchSnapshot('hide-textbox.png');
  await expect(page.locator('#displayed-text')).toBeHidden();
});
