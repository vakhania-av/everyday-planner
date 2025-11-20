import type { ITask } from "@/types/task.js";
import { BASE_API } from "../const.js";
import csrfService from "../services/csrfService.js";

interface GetTasksResponse {
  tasks: ITask[];
}

interface CreateTaskResponse {
  id: number;
  message: string;
}

interface UpdateTaskResponse {
  task: ITask;
}

function getError(err: unknown) {
  return err instanceof Error ? err.message : 'Unknown error';
}

/**
 * Вспомогательная функция для отправки запросов с поддержкой CSRF
 * @param {String} method 
 * @param {String} endpoint 
 * @param {JSON} body 
 * @returns Object
 */
async function sendRequest<T = unknown>(method: string, endpoint: string, body: unknown = null): Promise<T> {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // Автоматически устанавливаем CSRF-токен в заголовки

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

/**
 * Получение списка всех задач
 * @returns Object
 */
export const getTasks = async (): Promise<ITask[]> => {
  try {
    const response = await sendRequest<GetTasksResponse>('GET', `${BASE_API}/todos/read.php`);

    console.info('All the task have been successfully loaded!');

    return response.tasks;
  } catch (err) {
    console.error('An error occurred while loading task list:', getError(err));
    throw err;
  }
};

/**
 * Создание новой задачи
 * @param {Object} todo 
 * @returns Number
 */
export const createTask = async (taskData: Omit<ITask, 'id' | 'completed' | 'created_at' | 'updated_at'>): Promise<number> => {
  try {
    const response = await sendRequest<CreateTaskResponse>('POST', `${BASE_API}/todos/create.php`, taskData);

    console.info('A new task has successfully created!', response.message);

    return response.id;
  } catch (err) {
    console.error('Error occurred while creating task procedure:', getError(err));
    throw err;
  }
};

/**
 * Обновление существующей задачи
 * @param {Number} id 
 * @param {Object} updates 
 * @returns Object
 */
export const updateTask = async (id: number, updates: Partial<ITask>): Promise<ITask> => {
  try {
    const response = await sendRequest<UpdateTaskResponse>('POST', `${BASE_API}/todos/update.php?id=${id}`, updates);

    console.info('Task has been updated successfully');

    return response.task;
  } catch (err) {
    console.error('Error occured while updating task procedure: ', getError(err));
    throw err;
  }
};

/**
 * Удаление задачи
 * @param {Number} id 
 */
export const deleteTask = async (id: number): Promise<void> => {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers);

  try {
    const response = await fetch(`${BASE_API}/todos/delete.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers
    });

    if (response.status === 204) {
      console.info('The task has been deleted successfully (No Content)');
    } else {
      const data = await response.json();

      console.info('The task has been deleted successfully:', data);
    }
  } catch (err) {
    console.error('Error while deleting a task: ', getError(err));
    throw err;
  }
};
