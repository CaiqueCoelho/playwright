import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Task } from '../fixtures/task.dtype';
import { deleteTaskByHelper, createTask } from '../support/helpers';
import { TaskPage } from '../support/pages/TaskPage';
import data from '../fixtures/tasks.json';

let taskPage: TaskPage

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
})

test.describe('Task Creation', () => {

    test('Should be able to create a new task', async ({ page }) => {
        const input = page.getByRole('textbox', { name: 'Add a new Task'});
        page.goto('http://localhost:8080')
    
        await expect(input.first()).toBeVisible();
    
        // await expect(async () => {
        //     const count = await page.locator('button[class*=listItemDeleteButton]').count();
        //     return expect(count).toBeGreaterThan(0);
        // }).toPass()
    
        while (await page.locator('button[class*=listItemDeleteButton]').count() > 0) {
            console.log(await page.locator('button[class*=listItemDeleteButton]').count());
            await page.locator('button[class*=listItemDeleteButton]').first().click();
        }
    
        const task1 = faker.lorem.words();
        await input.fill(task1);
        await input.press('Enter');
        
        const task2 = faker.lorem.words();
        await page.locator('input[class*=listInputNewTask]').fill(task2);
        
        // await page.locator('//buton[text()="Create "]').click();
        await page.locator('xpath=//button[contains(text(), "Create")]').click();
        // await page.click('button:has-text("Create")');
        // await page.locator('css=buttton >> text=Create').click(); 
        await expect(page.getByRole('paragraph').filter({ hasText: task2 })).toBeVisible();
        await expect(page.locator(`p:has-text("${task1}")`)).toBeVisible();
    })
    
    test('Should be able to create a new task with clean by API', async ({ page, request }) => {
        const input = page.getByRole('textbox', { name: 'Add a new Task'});
        page.goto('/')
    
        await expect(input.first()).toBeVisible();
    
        const task1 = faker.lorem.words();
        await input.fill(task1);
        await input.press('Enter');
        
        const task2 = faker.lorem.words();
        await page.locator('input[class*=listInputNewTask]').fill(task2);
    
        await page.locator('xpath=//button[contains(text(), "Create")]').click();
    
        await expect(page.getByRole('paragraph').filter({ hasText: task2 })).toBeVisible();
        await expect(page.locator(`p:has-text("${task1}")`)).toBeVisible();
        // page.locator(`css=.task-item p >> text=${task1}`)
        await deleteTaskByHelper(request, task1);
        await deleteTaskByHelper(request, task2);
    })
    
    test('Should not allow duplicate tasks', async ({ page, request }) => {
        const task: Task = data.duplicate as Task;
    
        await deleteTaskByHelper(request, task.name);
        await createTask(request, task);
    
        await taskPage.goto();
        await taskPage.checkIfTaskExists(task);
        await taskPage.createTask(task);
        await taskPage.checkAlert('Task already exists');
    })

    test('Make sure task name is a required filed', async ({ page }) => {

        let postTaskRequest = false;
 
        page.on('request', request => {
        if (request.method() === 'POST' && request.url().includes("/tasks"))
            postTaskRequest = true
        })
    
        const task: Task = {
            name: '',
            is_done: false
        }

        await deleteTaskByHelper(page.request, task.name);

        await taskPage.goto();
        await expect(taskPage.inputTaskName.first()).toBeVisible();
    
        console.log(await page.locator('button[class*=listItemDeleteButton]').count());
    
        while (await page.locator('button[class*=listItemDeleteButton]').count() > 0) {
            console.log(await page.locator('button[class*=listItemDeleteButton]').count());
            await page.locator('button[class*=listItemDeleteButton]').first().click();
        }
        await taskPage.createTask(task);
        await page.waitForLoadState('load');
        await taskPage.checkInputTaskNameEmptyAlert(); 
        expect(postTaskRequest).toBe(false);
        console.log(postTaskRequest);
    })
})

test.describe('Task Update', () => {
    test('Should conclude one task', async({page}) => {
        const task = data.update as Task

        await deleteTaskByHelper(page.request, task.name);
        await createTask(page.request, task);

        await taskPage.goto();
        await taskPage.markAsDone(task);
    })

    test('Should delete one task', async({page}) => {
        const task = data.delete as Task    

        await deleteTaskByHelper(page.request, task.name);
        await createTask(page.request, task);

        await taskPage.goto();
        await taskPage.deleteTask(task);
        await taskPage.taskShouldNotExist(task)
    })

    test.only('Visual regression testing', async ({page}) => {

        const task1 = data.done1 as Task    
        const task2 = data.done2 as Task
        const task3 = data.done3 as Task

        await deleteTaskByHelper(page.request, task1.name);
        await deleteTaskByHelper(page.request, task2.name);
        await deleteTaskByHelper(page.request, task3.name);

        await taskPage.goto();

        console.log(await page.locator('button[class*=listItemDeleteButton]').count());
    
        while (await page.locator('button[class*=listItemDeleteButton]').count() > 0) {
            console.log(await page.locator('button[class*=listItemDeleteButton]').count());
            await page.locator('button[class*=listItemDeleteButton]').first().click();
        }

        await createTask(page.request, task1);
        await createTask(page.request, task2);
        await createTask(page.request, task3);

        await page.reload();
        taskPage.checkIfTaskExists(task1);
        taskPage.checkIfTaskExists(task2);
        taskPage.checkIfTaskExists(task3);

        await expect(page).toHaveScreenshot();

        await expect(page.locator('#newTask')).toHaveScreenshot('inputTaskElement.png');
    })
})