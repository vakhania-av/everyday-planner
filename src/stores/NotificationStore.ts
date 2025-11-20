import { action, computed, makeObservable, observable } from "mobx";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../api/notifications";
import { INotification } from "@/types/notification";
import type { RootStore } from "./index";

class NotificationStore {
  @observable notifications: INotification[] = [];
  @observable unreadCount: number = 0;
  @observable loading: boolean = false;
  @observable error: string = '';
  @observable expanded: boolean = false;
  @observable displayedCount: number = 5;

  private notificationsPerPage: number = 5;

  constructor(public rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  setNotifications = (notifications: INotification[]): void => {
    this.notifications = notifications;
  };

  @action
  setUnreadCount = (count: number): void => {
    this.unreadCount = count;
  };

  @action
  setLoading = (loading: boolean): void => {
    this.loading = loading;
  };

  @action
  setError = (error: string): void => {
    this.error = error;
  };

  @action
  setExpanded = (expanded: boolean): void => {
    this.expanded = expanded;
  };

  @action
  setDisplayedCount = (displayedCount: number): void => {
    this.displayedCount = displayedCount;
  };

  @action
  fetchNotifications = async (): Promise<void> => {
    if (!this.rootStore.authStore.currentUser || this.rootStore.authStore.loggingOut) {
      this.setLoading(false);
      this.setNotifications([]);
      this.setUnreadCount(0);

      return;
    }

    try {
      this.setLoading(true);

      const response = await getNotifications();

      response.data?.notifications

      if (response.success) {
        this.setNotifications(response.data?.notifications || []);
        this.setUnreadCount(response.data?.unreadCount || 0);
        this.setDisplayedCount(this.notificationsPerPage); // сброс при загрузке
        this.setExpanded(false); // сброс состояния
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      this.setError(`Failed to load notifications: ${message}`);
      console.error('Error: ', err);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  markAsRead = async (notificationId: number): Promise<void> => {
    try {
      await markNotificationAsRead(notificationId);
      this.setNotifications(this.notifications.map((notif) => notif.id === notificationId ? { ...notif, is_read: true } : notif));
      this.setUnreadCount(Math.max(0, this.unreadCount - 1));
    } catch (err) {
      console.error('Error marking notification as read: ', err);
    }
  };

  @action
  markAllAsRead = async (): Promise<void> => {
    try {
      await markAllNotificationsAsRead();
      this.setNotifications(this.notifications.map((notif) => ({ ...notif, is_read: true })));
      this.setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read: ', err);
    }
  };

  @action
  loadMore = (): void => {
    this.setDisplayedCount(Math.min(this.displayedCount + this.notificationsPerPage, this.notifications.length));
  };

  @action
  toggleExpanded = (): void => {
    this.setExpanded(!this.expanded);
  };

  // Определяем, что показывать
  @computed
  get visibleNotifications(): INotification[] {
    return this.expanded ? this.notifications : this.notifications.slice(0, this.displayedCount);
  }

  // Нужен ли скролл?
  @computed
  get shouldScroll(): boolean {
    return this.expanded || this.displayedCount > 5;
  }

  // Есть ли ещё что подгружать
  @computed
  get hasMoreToLoad(): boolean {
    return this.displayedCount < this.notifications.length;
  }

  @computed
  get notificationsPerPageValue(): number {
    return this.notificationsPerPage;
  }
}

export default NotificationStore;
