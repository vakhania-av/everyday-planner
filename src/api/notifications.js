import { BASE_API } from "../const.js";
import csrfService from "../services/csrfService.js";

let isLoggedOut = false;

export const setLoggedOut = () => {
  isLoggedOut = true;
};

export const resetLoggedOut = () => {
  isLoggedOut = false;
};

async function sendRequest(method, endpoint, body = null) {
  const headers = new Headers();

  await csrfService.addCsrfHeaders(headers);

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

export const getNotifications = async () => {
  if (isLoggedOut) {
    return;
  }

  try {
    const response = await sendRequest('GET', `${BASE_API}/notifications/notification.php`);

    return response;
  } catch (err) {
    console.error('Error fetching notifications:', err);

    throw err;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await sendRequest('POST', `${BASE_API}/notifications/notification.php`, {
      id: notificationId,
      option: 'mark-read'
    });

    return response.success;
  } catch (err) {
    console.error('Error marking notification as read: ', err);

    throw err;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await sendRequest('POST', `${BASE_API}/notifications/notification.php`, {
      option: 'mark-all-read'
    });

    return response.success;
  } catch (err) {
    console.error('Error marking all notifications as read: ', err);

    throw err;
  }
};