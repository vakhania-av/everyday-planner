import { BASE_API } from "../const.js";
import csrfService from "../services/csrfService.js";

/**
 * Вспомогательная функция для отправки запросов с поддержкой CSRF
 * @param {String} method 
 * @param {String} endpoint 
 * @param {JSON} body 
 * @returns Object
 */
async function sendRequest(method, endpoint, body = null) {
  const headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // Автоматически устанавливаем CSRF-токен в заголовки

  const options = {
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
export const getTasks = async () => {
  try {
    const data = await sendRequest('GET', `${BASE_API}/todos/read.php`);

    console.info('All the task have been successfully loaded!');

    return data.tasks;
  } catch (err) {
    console.error('An error occured while loading task list:', err.message);

    throw err;
  }
};

/**
 * Создание новой задачи
 * @param {Object} todo 
 * @returns Number
 */
export const createTask = async (taskData) => {
  try {
    const data = await sendRequest('POST', `${BASE_API}/todos/create.php`, taskData);

    console.info('A new task has successfully created!', data.message);

    return data.id;
  } catch (err) {
    console.error('Error occured while creating task procedure:', err.message);

    throw err;
  }
};

/**
 * Обновление существующей задачи
 * @param {Number} id 
 * @param {Object} updates 
 * @returns Object
 */
export const updateTask = async (id, updates) => {
  try {
    const data = await sendRequest('POST', `${BASE_API}/todos/update.php?id=${id}`, updates);

    console.info('Task has been updated successfully');

    return data.task;
  } catch (err) {
    console.error('Error occured while updating task procedure: ', err.message);

    throw err;
  }
};

/**
 * Удаление задачи
 * @param {Number} id 
 */
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${BASE_API}/todos/delete.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: await csrfService.addCsrfHeaders(new Headers())
    });

    if (response.status === 204) {
      console.info('The task has been deleted successfully (No Content)');
    } else {
      const data = await response.json();

      console.info('The task has been deleted successfully:', data);
    }
  } catch (err) {
    console.error('Error while deleting a task: ', err.message);

    throw err;
  }
};
