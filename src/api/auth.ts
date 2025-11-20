import type { IUser } from "@/types/user.js";
import { BASE_API, METHODS } from "../const.js";
import csrfService from '../services/csrfService.js';

// Типы ответов для API
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface LoginResponse {
  user: IUser;
}

interface RegisterResponse {
  user: IUser;
}

interface AuthCheckResponse {
  authenticated: boolean;
  user?: IUser;
}

interface UpdateUserResponse {
  user: IUser;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
}

const handleResponse = async<T = unknown>(response: Response): Promise<T> => {
  if (!response.ok) {
    try {
      // Если сервер возвращает JSON с ошибкой
      const errorData: ApiResponse = await response.json()

      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return response.json();
};

/**
 * Обработчик ошибок CSRF
 * @param {Promise} response 
 */
async function handleCsrfError(response: Response): Promise<boolean> {
  if (response.status === 403) {
    try {
      const data: ApiResponse = await response.json();

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
    } catch {
      // Если не удалось распарсить JSON, не обрабатываем как CSRF ошибку
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
async function sendRequest<T = unknown>(method: string, endpoint: string, body: unknown = null): Promise<T> {
  const headers: Headers = new Headers();

  if (body !== null || METHODS.includes(method.toUpperCase())) {
    await csrfService.addCsrfHeaders(headers); // Добавляем CSRF-токены для изменений
  }

  console.log('TOKEN:', await csrfService.getToken());

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(endpoint, options);

  // Повторный запрос при CSRF-ошибке
  if ((await handleCsrfError(response))) {
    // Повторяем запрос после обновления CSRF-токена
    response = await fetch(endpoint, options);
  }

  return handleResponse<T>(response);
}

// Экспорт функций аутентификации
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const result = await sendRequest<LoginResponse>('POST', `${BASE_API}/auth/login.php`, { email, password });

  await csrfService.refreshToken(); // Обновление CSRF после успешной авторизации

  return result;
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  const result = await sendRequest<RegisterResponse>('POST', `${BASE_API}/auth/register.php`, { name, email, password });

  await csrfService.refreshToken(); // Обновление CSRF после регистрации

  return result;
};

export const logout = async (): Promise<void> => {
  await sendRequest<void>('POST', `${BASE_API}/auth/logout.php`);

  csrfService.clearToken(); // Очищаем токен после выхода
};

export const checkAuth = async (): Promise<AuthCheckResponse> => {
  return await sendRequest<AuthCheckResponse>('GET', `${BASE_API}/auth/check.php`);
};

/**
 * Обновление профиля пользователя
 * @param {Promise} data 
 * @returns String
 */
export const updateUser = async (data: { name: string; email: string }): Promise<UpdateUserResponse> => {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // Добавляем CSRF-токен в заголовки

  try {
    const response = await fetch(`${BASE_API}/profile/edit.php`, {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: JSON.stringify({ data })
    });

    if (response.ok) {
      const json: UpdateUserResponse = await response.json();

      console.info('Updated user successfully');

      return json;
    } 
      
    throw new Error(`User updating error: status ${response.status}`);
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    throw new Error(`User updating error: ${errorMessage}`);
  }
};

/**
 * Отправка письма сброса пароля
 * @param {String} email 
 * @returns Object
 */
export const sendPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers); // автоматически добавляем CSRF-токен

  try {
    const response = await fetch(`${BASE_API}/auth/forgot-password.php`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      const data: PasswordResetResponse = await response.json();

      console.info('Password reset successfully');

      return data;
    }
      
    throw new Error(`An error occured while sending an email reset link: status ${response.status}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';

    throw new Error(errorMessage);
  }
};

/**
 * Процесс смены пароля после ввода специального токена подтверждения
 * @param {String} token 
 * @param {String} password 
 * @returns Object
 */
export const resetPassword = async (token: string, password: string) => {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers);

  try {
    const response = await fetch(`${BASE_API}/auth/reset-password.php`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ token, password })
    });

    if (response.ok) {
      const data: PasswordResetResponse = await response.json();

      console.info('Password reset successfully');

      return data;
    } 
      
    throw new Error(`An error occured while requesting a password reset link: status ${response.status}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to reset password!';

    throw new Error(errorMessage);
  }
};

/**
 * Инициализация CSRF-токена при старте приложения
 */
export const initializeCsrfToken = async (): Promise<void> => {
  try {
    await csrfService.refreshToken();
  } catch (err) {
    console.error('Failed to initialize CSRF token:', err);
  }
};
