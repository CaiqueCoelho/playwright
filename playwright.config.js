// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 31 * 1000, // 30 seconds
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 8000, // will wait for 5 seconds
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    browserName: 'chromium',
    headless: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    {
      name: 'course2',
      testMatch: "**/course-2/**.spec.ts",
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:8080'
      },
    },
    {
      name: 'course1',
      testMatch: "**/course-1/**.spec.js",
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'iphone11',
    //   use: {
    //     /* Base URL to use in actions like `await page.goto('/')`. */
    //     // baseURL: 'http://127.0.0.1:3000',
    //     browserName: 'webkit',
    //     headless: true,
    //     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //     trace: 'retain-on-failure',
    //     screenshot: 'only-on-failure',
    //     ignoreHTTPSErrors: true,
    //     ...devices['iPhone 11'],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
