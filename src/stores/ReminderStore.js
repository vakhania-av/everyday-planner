import { action, computed, makeObservable, observable } from "mobx";
import { DEFAULT_NOTIFICATION_TIME } from "../const";
import dayjs from "dayjs";
import { clearTimers } from "mobx-react-lite";

class ReminderStore {
  // Для управления таймерами
  dailyIntervalId = null;
  timeoutIds = new Map(); // reminder.id → timeoutId

  @observable reminders = [];
  @observable enabled = true;
  @observable notificationTime = DEFAULT_NOTIFICATION_TIME; // Время уведомлений

  constructor() {
    makeObservable(this);

    this.loadRemindersFromStorage();
    this.setupDailyReminder();
  }

  @action
  setEnabled = (enabled) => {
    this.enabled = enabled;

    if (!enabled) {
      clearTimers();
    } else {
      this.setupDailyReminder();
    }

    this.saveRemindersToStorage();
  };

  @action
  setNotificationTime = (time) => {
    this.notificationTime = time;
    this.setupDailyReminder(); // перезапускаем с новым временем
    this.saveRemindersToStorage();
  };

  @action
  addReminder = (taskId, taskTitle, deadline, reminderType = 'deadline') => {
    const reminder = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      taskTitle,
      deadline,
      reminderType,
      createdAt: new Date().toISOString()
    };

    this.reminders.push(reminder);
    this.saveRemindersToStorage();
    this.sheduleNotification(reminder);
  };

  @action
  removeReminder = (reminderId) => {
    // Отменяем таймер, если есть
    const timeoutId = this.timeoutIds.get(reminderId);

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(reminderId);
    }

    this.reminders = this.reminders.filter((r) => r.id !== reminderId);
    this.saveRemindersToStorage();
  };

  @action
  checkDeadlineReminders = (tasks) => {
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
  setupDailyReminder = () => {
    this.clearDailyTimer();

    if (!this.enabled) {
      return;
    }

    // Проверяем каждый день в установленное время
    const [hours, minutes] = this.notificationTime.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(hours, minutes, 0, 0);

    let timeUntilNotification = targetTime - now;

    if (timeUntilNotification < 0) {
      timeUntilNotification += 24 * 60 * 60 * 1000; // Добавляем сутки
    }

    setTimeout(() => {
      this.sendDailyDigest();

      // Повторяем каждый день
      this.dailyIntervalId = setInterval(() => this.sendDailyDigest(), 24 * 60 * 60 * 1000);
    }, timeUntilNotification);
  };

  @action
  sendDailyDigest = () => {
    if (!this.enabled) {
      return;
    }

    // Здесь будеит логика отправки ежедневного дайджеста
    // Пока просто логируем
    console.log('Daily digest sent at', new Date().toLocaleString());
  };

  sheduleNotification = (reminder) => {
    const deadline = dayjs(reminder.deadline);

    let notificationTime;

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
      const timeoutId = setTimeout(() => {
        this.showBrowserNotification(reminder);
        this.removeReminder(reminder.id);
        this.timeoutIds.delete(reminder.id);
      }, timeUntilNotification);

      this.timeoutIds.set(reminder.id, timeoutId);
    }
  };

  showBrowserNotification = (reminder) => {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Task notification', {
        body: `The task "${reminder.taskTitle}" will be delayed soon!`,
        icon: '/icon.png',
        tag: reminder.taskId
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showBrowserNotification(reminder);
        }
      });
    }
  };

  getNotificationTime(reminder) {
    const deadline = dayjs(reminder.deadline);

    switch (reminder.reminderType) {
      case '24h': return deadline.subtract(24, 'hour').valueOf();
      case '1h': return deadline.subtract(1, 'hour').valueOf();
      default: return deadline.valueOf();
    }
  }

  @computed
  get upcomingReminders() {
    this.reminders
    .map((r) => ({
      ...r,
      notifyAt: this.getNotificationTime(r)
    }))
    .sort((a, b) => a.notifyAt - b.notifyAt)
    .slice(0, 5);
  }

  @action
  loadRemindersFromStorage = () => {
    const saved = localStorage.getItem('app-reminders');

    if (saved) {
      const { reminders, enabled, notificationTime } = JSON.parse(saved);

      this.reminders = reminders || [];
      this.enabled = enabled !== false;
      this.notificationTime = notificationTime || DEFAULT_NOTIFICATION_TIME;
    }
  };

  @action
  saveRemindersToStorage = () => {
    localStorage.setItem('app-reminders', JSON.stringify({
      reminders: this.reminders,
      enabled: this.enabled,
      notificationTime: this.notificationTime
    }));
  };

  clearDailyTimer = () => {
    if (this.dailyIntervalId) {
      clearInterval(this.dailyIntervalId);
      this.dailyIntervalId = null;
    }
  };

  clearAllTimeouts = () => {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds.clear();
  };

  dispose = () => {
    if (this.dailyIntervalId) {
      clearInterval(this.dailyIntervalId);
    }
  };
}

export default ReminderStore;
