import { keyframes } from "@mui/material";

export const BASE_API = import.meta.env.DEV ? 'http://localhost/my-todo-app/api' : '/api';

export const CSRF_TOKEN_API = `${BASE_API}/auth/csrf-token.php`;

export const METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export type HttpMethod = typeof METHODS[number];

export const categories = [
  { id: 'work', name: 'Work', color: 'primary' },
  { id: 'personal', name: 'Personal', color: 'secondary' },
  { id: 'shopping', name: 'Shopping', color: 'success' },
  { id: 'other', name: 'Other', color: 'default' }
] as const;

export type Category = typeof categories[number];

export type CategoryId = Category['id'];

export const shakeAnimation = keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
    20%, 40%, 60%, 80% { transform: translateX(6px); }
  `;

export const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'deadline', label: 'By Deadline' },
  { value: 'name', label: 'By Name' },
] as const;

export type SortOption = typeof sortOptions[number];

export type SortValue = SortOption['value'];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] as const;

export type ChartColor = typeof COLORS[number];

export const DefaultSettings = {
  DateFormat: 'YYYY-MM-DD',
  NotificationTime: '09:00',
  RowHeight: 85,
  TimeoutDelay: 3000
} as const;