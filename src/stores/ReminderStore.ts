import { action, computed, makeObservable, observable } from "mobx";
import dayjs, { Dayjs } from "dayjs";
import { IReminder, ReminderType } from "@/types/reminder";
import { ITask } from "@/types";
import { DefaultSettings } from "@/const";

class ReminderStore {
  // Для управления таймерами
  private dailyIntervalId: number | null = null;
  private timeoutIds = new Map<string, number>(); // reminder.id → timeoutId

  @observable reminders: IReminder[] = [];
  @observable enabled: boolean = true;
  @observable notificationTime: string = DefaultSettings.NotificationTime; // Время уведомлений

  constructor() {
    makeObservable(this);

    this.loadRemindersFromStorage();
    this.setupDailyReminder();
  }

  @action
  setEnabled = (enabled: boolean): void => {
    this.enabled = enabled;

    if (!enabled) {
      this.clearAllTimeouts();
      this.clearDailyTimer();
    } else {
      this.setupDailyReminder();
    }

    this.saveRemindersToStorage();
  };

  @action
  setNotificationTime = (time: string): void => {
    this.notificationTime = time;
    this.setupDailyReminder(); // перезапускаем с новым временем
    this.saveRemindersToStorage();
  };

  @action
  addReminder = (taskId: number, taskTitle: string, deadline: string, reminderType: ReminderType = 'deadline'): void => {
    const reminder = {
      id: Math.random().toString(36).substring(2, 11),
      taskId,
      taskTitle,
      deadline,
      reminderType,
      createdAt: new Date().toISOString()
    };

    this.reminders.push(reminder);
    this.saveRemindersToStorage();
    this.scheduleNotification(reminder);
  };

  @action
  removeReminder = (reminderId: string): void => {
    // Отменяем таймер, если есть
    const timeoutId = this.timeoutIds.get(reminderId);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      this.timeoutIds.delete(reminderId);
    }

    this.reminders = this.reminders.filter((r) => r.id !== reminderId);
    this.saveRemindersToStorage();
  };

  @action
  checkDeadlineReminders = (tasks: ITask[]): void => {
    if (!this.enabled) {
      return;
    }

    const now = dayjs();

    tasks.forEach(task => {
      if (!task.completed && task.deadline) {
        const deadline = dayjs(task.deadline);
        const hoursUntilDeadline = deadline.diff(now, 'hour');

        let exists;

        // Напоминание за 24 часа
        if (hoursUntilDeadline <= 24 && hoursUntilDeadline > 0) {
          exists = this.reminders.some((r) => r.taskId === task.id && r.reminderType === '24h');

          if (!exists) {
            this.addReminder(task.id, task.title, task.deadline, '24h');
          }
        }

        // Напоминание за 1 час
        if (hoursUntilDeadline <= 1 && hoursUntilDeadline > 0) {
          exists = this.reminders.some((r) => r.taskId === task.id && r.reminderType === '1h');

          if (!exists) {
            this.addReminder(task.id, task.title, task.deadline, '1h');
          }
        }
      }
    });
  };

  @action
  setupDailyReminder = (): void => {
    this.clearDailyTimer();

    if (!this.enabled) {
      return;
    }

    // Проверяем каждый день в установленное время
    const [hours, minutes] = this.notificationTime.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(hours, minutes, 0, 0);

    let timeUntilNotification = targetTime.getTime() - now.getTime();

    if (timeUntilNotification < 0) {
      timeUntilNotification += 24 * 60 * 60 * 1000; // Добавляем сутки
    }

    setTimeout(() => {
      this.sendDailyDigest();
      // Повторяем каждый день
      this.dailyIntervalId = window.setInterval(() => this.sendDailyDigest(), 24 * 60 * 60 * 1000);
    }, timeUntilNotification);
  };

  @action
  sendDailyDigest = (): void => {
    if (!this.enabled) {
      return;
    }

    // Здесь будеит логика отправки ежедневного дайджеста
    // Пока просто логируем
    console.log('Daily digest sent at', new Date().toLocaleString());
  };

  scheduleNotification = (reminder: IReminder): void => {
    const deadline = dayjs(reminder.deadline);

    let notificationTime: Dayjs | null = null;

    switch (reminder.reminderType) {
      case '24h':
        notificationTime = deadline.subtract(24, 'hour');
        break;
      case '1h':
        notificationTime = deadline.subtract(1, 'hour');
        break;
      default: return;
    }

    const timeUntilNotification = notificationTime.diff(dayjs());

    if (timeUntilNotification > 0) {
      const timeoutId = window.setTimeout(() => {
        this.showBrowserNotification(reminder);
        this.removeReminder(reminder.id);
      }, timeUntilNotification);

      this.timeoutIds.set(reminder.id, timeoutId);
    }
  };

  private showBrowserNotification = (reminder: IReminder): void => {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Task notification', {
        body: `The task "${reminder.taskTitle}" will be delayed soon!`,
        icon: '/icon.png',
        tag: String(reminder.taskId)
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showBrowserNotification(reminder);
        }
      });
    }
  };

  private getNotificationTime(reminder: IReminder): number {
    const deadline = dayjs(reminder.deadline);

    switch (reminder.reminderType) {
      case '24h': return deadline.subtract(24, 'hour').valueOf();
      case '1h': return deadline.subtract(1, 'hour').valueOf();
      default: return deadline.valueOf();
    }
  }

  @computed
  get upcomingReminders(): IReminder[] {
    return this.reminders
    .map((r) => ({
      ...r,
      notifyAt: this.getNotificationTime(r)
    }))
    .sort((a, b) => a.notifyAt - b.notifyAt)
    .slice(0, 5);
  }

  @action
  loadRemindersFromStorage = (): void => {
    const saved = localStorage.getItem('app-reminders');

    if (saved) {
      try {
        const { reminders, enabled, notificationTime } = JSON.parse(saved) as Partial<{ 
        reminders: IReminder[];
        enabled: boolean;
        notificationTime: string;
      }>;

      this.reminders = Array.isArray(reminders) ? reminders : [];
      this.enabled = enabled !== undefined ? enabled : true;
      this.notificationTime = typeof notificationTime === 'string' ? notificationTime : DefaultSettings.NotificationTime;
      } catch (err) {
        console.warn('Failed to parse reminders from localStorage', err);
      }
    }
  };

  @action
  saveRemindersToStorage = (): void => {
    localStorage.setItem('app-reminders', JSON.stringify({
      reminders: this.reminders,
      enabled: this.enabled,
      notificationTime: this.notificationTime
    }));
  };

  private clearDailyTimer = (): void => {
    if (this.dailyIntervalId !== null) {
      window.clearInterval(this.dailyIntervalId);
      this.dailyIntervalId = null;
    }
  };

  private clearAllTimeouts = (): void => {
    this.timeoutIds.forEach((id) => window.clearTimeout(id));
    this.timeoutIds.clear();
  };

  dispose = (): void => {
    this.clearDailyTimer();
    this.clearAllTimeouts();
  };
}

export default ReminderStore;
