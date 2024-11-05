import { test as baseTest } from '@playwright/test';

interface TestDataForOrder {
  email: string;
  password: string;
  productName: string;
}

export const customTest = baseTest.extend<{
  testDataForOrder: TestDataForOrder;
}>({
  testDataForOrder: {
    email: 'caiquedpfc@gmail.com',
    password: '$7DHhQP@PhiK8N',
    productName: 'ZARA COAT 3',
  },
});
