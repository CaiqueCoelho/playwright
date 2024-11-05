import {test, expect} from '@playwright/test';

test('Webapp should be running', async ({page}) => {

    await page.goto('http://localhost:8080');
    await expect(page).toHaveTitle(/Gerencie suas tarefas com Mark L/)
})