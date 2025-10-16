import { BASE_API, METHODS } from "../const.js";
import csrfService from '../services/csrfService.js';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};

    try {
      errorData = await response.json() // Если сервер возвращает JSON с ошибкой

      throw errorData;
    } catch {
      throw new Error(errorData.error);
    }
  }

  return response.json();
};

/**
 * Обработчик ошибок CSRF
 * @param {Promise} response 
 */
async function handleCsrfError(response) {
  if (response.status === 403) {
    const data = await response.json();

    // Если токен невалиден, пробуем обновить 
    if (data.error && data.error.includes('CSRF')) {
      try {
        await csrfService.refreshToken();

        return true; // Токен успешно обновлён
      } catch (err) {
        console.error('CSRF token refresh failed:', err);
        window.location.href = '/login'; // Перенаправление на страницу логина
      }
    }
  }

  return false;
}

/**
 * Функция отправки HTTP-запросов с поддержкой CSRF
 * @param {String} method 
 * @param {String} endpoint 
 * @param {JSON} body 
 */
async function sendRequest(method, endpoint, body = null) {
  const headers = new Headers();

  if (body !== null || METHODS.includes(method.toUpperCase())) {
    await csrfService.addCsrfHeaders(headers); // Добавляем CSRF-токены для изменений
  }

  console.log('TOKEN:', await csrfService.getToken());

  const options = {
    method,
    credentials: 'include',
    headers
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(endpoint, options);

  if ((await handleCsrfError(response))) {
    // Повторяем запрос после обновления CSRF-токена
    response = await fetch(endpoint, options);
  }

  return handleResponse(response);
}

// Экспорт функций аутентификации
export const login = async (email, password) => {
  const result = await sendRequest('POST', `${BASE_API}/auth/login.php`, { email, password });

  await csrfService.refreshToken(); // Обновление CSRF после успешной авторизации

  return result;
};

export const register = async (name, email, password) => {
  const result = await sendRequest('POST', `${BASE_API}/auth/register.php`, { name, email, password });

  await csrfService.refreshToken(); // Обновление CSRF после регистрации

  return result;
};

export const logout = async () => {
  await sendRequest('POST', `${BASE_API}/auth/logout.php`);

  csrfService.clearToken(); // Очищаем токен после выхода
};

export const checkAuth = async () => {
  return await sendRequest('GET', `${BASE_API}/auth/check.php`);
};

/**
 * Обновление профиля пользователя
 * @param {Promise} data 
 * @returns String
 */
export const updateUser = async (data) => {
  const headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // Добавляем CSRF-токен в заголовки

  try {
    const response = await fetch(`${BASE_API}/profile/edit.php`, {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: JSON.stringify({ data })
    });

    if (response.ok) {
      const json = await response.json();

      console.info('Updated user successfully');

      return json?.user;
    } else {
      throw new Error(`User updating error: status ${response.status}`);
    }
  } catch (err) {
    throw new Error('User updating error: ', err.response?.data || err.message);
  }
};

/**
 * Отправка письма сброса пароля
 * @param {String} email 
 * @returns Object
 */
export const sendPasswordReset = async (email) => {
  const headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // автоматически добавляем CSRF-токен

  try {
    const response = await fetch(`${BASE_API}/auth/forgot-password.php`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      const data = await response.json();

      console.info('Password reset successfully');
      console.info(data.message);
      console.info(data.data);

      return data;
    } else {
      throw new Error(`An error occured while sending an email reset link: status ${response.status}`);
    }
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to send reset email');
  }
};

/**
 * Процесс смены пароля после ввода специального токена подтверждения
 * @param {String} token 
 * @param {String} password 
 * @returns Object
 */
export const resetPassword = async (token, password) => {
  const headers = new Headers();

  await csrfService.addCsrfHeaders(headers);

  try {
    const response = await fetch(`${BASE_API}/auth/reset-password.php`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ token, password })
    });

    if (response.ok) {
      const data = await response.json();

      console.info('Password reset successfully');

      return data;
    } else {
      throw new Error(`An error occured while requesting a password reset link: status ${response.status}`);
    }
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to reset password!');
  }
};

/**
 * Инициализация CSRF-токена при старте приложения
 */
export const initializeCsrfToken = async () => {
  try {
    await csrfService.refreshToken();
  } catch (err) {
    console.error('Failed to initialize CSRF token:', err);
  }
};
