import { CSRF_TOKEN_API } from "../const.js";

class CsrfService {
  static key: string = "csrf_token";

  private token: string | null = null;
  private isRefreshing: boolean = false;
  private requests: ((token: string) => void)[] = [];

  async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    return await this.refreshToken();
  }

  async setToken(token: string): Promise<void> {
    localStorage.setItem(CsrfService.key, token);
  }

  async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise<string>((resolve) => {
        this.requests.push(resolve)
      });
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
        const data: { success: boolean, token: string } = await response.json();

        if (data.success) {
          this.token = data.token;
          await this.setToken(this.token);

          // Выполняем все ожидающие запросы
          this.requests.forEach((resolve) => resolve(this.token!));
          this.requests = [];

          return this.token;
        }
      }

      throw new Error('Failed to get CSRF token');
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
  async addCsrfHeaders(headers: Headers): Promise<void> {
    headers.set('Content-Type', 'application/json');

    const token = await this.getToken();

    headers.set('X-CSRF-Token', token);
  }

  getStoredToken(): string | null {
    return localStorage.getItem(CsrfService.key);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem(CsrfService.key);
  }
}

export default new CsrfService();
