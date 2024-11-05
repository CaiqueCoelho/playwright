import { Locator, Page, expect } from '@playwright/test';
import { Task } from '../../fixtures/task.dtype';

export class TaskPage {

    readonly page: Page;
    readonly inputTaskName: Locator;
    readonly btnCreateTask: Locator;
    constructor(page: Page) {
        this.page = page;
        this.inputTaskName = page.getByRole('textbox', { name: 'Add a new Task'});
        this.btnCreateTask = page.getByRole('button', { name: 'Create '});
    }

    async createTask(task: Task) {
        await this.inputTaskName.fill(task.name);
        await this.btnCreateTask.click();
    }

    async goto() {
        await this.page.goto('http://localhost:8080/');
    }

    async checkIfTaskExists(task: Task) {
        await expect(this.page.getByRole('paragraph').filter({ hasText: task.name })).toBeVisible();
    }

    async taskShouldNotExist(task: Task) {
        // await this.page.getByRole('paragraph').filter({ hasText: task.name }).click();
        expect(this.page.getByText(task.name)).not.toBeVisible();
    }

    async checkInputTaskNameEmptyAlert() {
        const validationMessage = await this.inputTaskName.evaluate((el) => (el as HTMLInputElement).validationMessage);
        expect(validationMessage).toEqual('This is a required field');
    }

    async checkAlert(text: string) {
        await expect(this.page.getByText(text)).toBeVisible();
    }

    async markAsDone(task: Task) {
        // await this.page.getByRole('checkbox', { name: task.name }).click();
        // const taskToogleButton = this.page.locator(`xpath=//p[text()="${task.name}"]`).locator('..').locator("button[class*='listItemToggle']")
        // const taskToogleButton = this.page.locator(`xpath=//p[text()="${task.name}"]`).locator('..').locator("button[contains(@class, 'Toggle')]")
        const taskToogleButton = this.page.getByText(task.name).locator('..').locator("button[class*='listItemToggle']")
        // const taskToogleButton = this.page.getByTestId('task-item').filter({ hasText: task.name }).locator('..').locator('button').first()
        await taskToogleButton.click();
        //this.page.pause()
        await expect(this.page.getByText(task.name)).toHaveClass(/listItemTextSelected/)
        await expect(this.page.getByText(task.name)).toHaveCSS('text-decoration-line', 'line-through')
    }

    async deleteTask(task: Task) {
        const taskDeleteButton = this.page.getByText(task.name).locator('..').locator("button[class*='listItemDelete']")
        await taskDeleteButton.click();
    }
}