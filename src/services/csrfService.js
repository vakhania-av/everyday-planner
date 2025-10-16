import { CSRF_TOKEN_API } from "../const.js";

class CsrfService {
  static key = "csrf_token";

  constructor() {
    this.token = null;
    this.isRefreshing = false;
    this.requests = [];
  }

  async getToken() {
    if (this.token) {
      return this.token;
    }

    return await this.refreshToken();
  }

  async setToken(token) {
    localStorage.setItem(CsrfService.key, token);
  }

  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve) => this.requests.push(resolve));
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(CSRF_TOKEN_API, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          this.token = data.token;
          this.setToken(this.token);

          // Выполняем все ожидающие запросы
          this.requests.forEach((resolve) => resolve(this.token));
          this.requests = [];

          return this.token;
        }
      } else {
        throw new Error('Failed to get CSRF token');
      }
    } catch (err) {
      console.error('CSRF token refresh failed:', err);

      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
 * Функция для добавления CSRF-токена в заголовки
 * @param {Map} headers
 */
  async addCsrfHeaders(headers) {
    headers.set('Content-Type', 'application/json');

    const token = await this.getToken();

    headers.set('X-CSRF-Token', token);
  }

  getStoredToken() {
    return localStorage.getItem(CsrfService.key);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(CsrfService.key);
  }
}

export default new CsrfService();
