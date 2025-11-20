import type { INotification } from "@/types/notification.js";
import { BASE_API } from "../const.js";
import csrfService from "../services/csrfService.js";

// Типы ответов для API
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface INotificationsResponseData {
  notifications: INotification[];
  unreadCount: number;
}

async function sendRequest<T = unknown>(method: string, endpoint: string, body: unknown = null): Promise<T> {
  const headers: Headers = new Headers();

  await csrfService.addCsrfHeaders(headers);

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

export const getNotifications = async (): Promise<ApiResponse<INotificationsResponseData>> => {
  try {
    return await sendRequest('GET', `${BASE_API}/notifications/notification.php`);
  } catch (err) {
    console.error('Error fetching notifications:', err);

    throw err;
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<boolean> => {
  const response: ApiResponse = await sendRequest('POST', `${BASE_API}/notifications/notification.php`, {
    id: notificationId,
    option: 'mark-read'
  });

  return response.success;
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const response: ApiResponse = await sendRequest('POST', `${BASE_API}/notifications/notification.php`, {
    option: 'mark-all-read'
  });

  return response.success;
};
