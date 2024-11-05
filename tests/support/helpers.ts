import { expect, APIRequestContext } from '@playwright/test';
import { Task } from '../fixtures/task.dtype';

require('dotenv').config();
const BASE_API = process.env.BASE_API;

export async function deleteTaskByHelper(request: APIRequestContext, taskName: String) {
    await request.delete(`${BASE_API}/helper/tasks/${taskName}`);
}

export async function createTask(request: APIRequestContext, task: Task) {
    const newTask = await request.post(`${BASE_API}/tasks`, {data: task});
    expect(newTask.ok()).toBeTruthy();
}