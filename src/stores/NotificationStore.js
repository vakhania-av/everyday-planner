import { action, computed, makeObservable, observable } from "mobx";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../api/notifications";

class NotificationStore {
  @observable notifications = [];
  @observable unreadCount = 0;
  @observable loading = false;
  @observable error = '';
  @observable expanded = false;
  @observable displayedCount = 5;

  constructor(authStore) {
    makeObservable(this);
    this.authStore = authStore;
    this.notificationsPerPage = 5;
  }

  @action
  setNotifications = (notifications) => {
    this.notifications = notifications;
  };

  @action
  setUnreadCount = (count) => {
    this.unreadCount = count;
  };

  @action
  setLoading = (loading) => {
    this.loading = loading;
  };

  @action
  setError = (error) => {
    this.error = error;
  };

  @action
  setExpanded = (expanded) => {
    this.expanded = expanded;
  };

  @action
  setDisplayedCount = (displayedCount) => {
    this.displayedCount = displayedCount;
  };

  @action
  fetchNotifications = async () => {
    if (!this.authStore.currentUser || this.authStore.loggingOut) {
      this.setLoading(false);
      this.setNotifications([]);
      this.setUnreadCount(0);

      return;
    }

    try {
      this.setLoading(true);

      const response = await getNotifications();

      if (response?.success) {
        this.setNotifications(response.notifications);
        this.setUnreadCount(response.unreadCount);
        this.setDisplayedCount(this.notificationsPerPage); // сброс при загрузке
        this.setExpanded(false); // сброс состояния
      }
    } catch (err) {
      this.setError('Failed to load notifications');
      console.error('Error: ', err);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      this.setNotifications(this.notifications.map((notif) => notif.id === notificationId ? { ...notif, is_read: true } : notif));
      this.setUnreadCount(Math.max(0, this.unreadCount - 1));
    } catch (err) {
      console.error('Error marking notification as read: ', err);
    }
  };

  @action
  markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      this.setNotifications(this.notifications.map((notif) => ({ ...notif, is_read: true })));
      this.setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read: ', err);
    }
  };

  @action
  loadMore = () => {
    this.setDisplayedCount(Math.min(this.displayedCount + this.notificationsPerPage, this.notifications.length));
  };

  @action
  toggleExpanded = () => {
    this.setExpanded(!this.expanded);
  };

  // Определяем, что показывать
  @computed
  get visibleNotifications() {
    return this.expanded ? this.notifications : this.notifications.slice(0, this.displayedCount);
  }

  // Нужен ли скролл?
  @computed
  get shouldScroll() {
    return this.expanded || this.displayedCount > 5;
  }

  // Есть ли ещё что подгружать
  @computed
  get hasMoreToLoad() {
    return this.displayedCount < this.notifications.length;
  }
}

export default NotificationStore;
