import { keyframes } from "@mui/material";

export const BASE_API = import.meta.env.DEV ? 'http://localhost/my-todo-app/api' : '/api';

export const CSRF_TOKEN_API = `${BASE_API}/auth/csrf-token.php`;

export const METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const categories = [
  { id: 'work', name: 'Work', color: 'primary' },
  { id: 'personal', name: 'Personal', color: 'secondary' },
  { id: 'shopping', name: 'Shopping', color: 'success' },
  { id: 'other', name: 'Other', color: 'default' }
];

export const shakeAnimation = keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
    20%, 40%, 60%, 80% { transform: translateX(6px); }
  `;

export const TIMEOUT_DELAY = 3000;

export const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'deadline', label: 'By Deadline' },
  { value: 'name', label: 'By Name' },
];
