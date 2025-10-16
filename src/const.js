export const BASE_API = import.meta.env.DEV ? 'http://localhost/my-todo-app/api' : '/api';

export const CSRF_TOKEN_API = `${BASE_API}/auth/csrf-token.php`;

export const METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const categories = [
  { id: 'work', name: 'Work', color: 'primary' },
  { id: 'personal', name: 'Personal', color: 'secondary' },
  { id: 'shopping', name: 'Shopping', color: 'success' },
  { id: 'other', name: 'Other', color: 'default' }
];

export const TIMEOUT_DELAY = 3000;