import { action, computed, makeObservable, observable } from "mobx";

class ReminderStore {
  @observable reminders = [];
  @observable enabled = true;
  @observable notificationTime = '09:00'; // Время уведомлений

  constructor() {
    makeObservable(this);

    this.loadRemindersFromStorage();
    this.setupDailyReminder();
  }

  @action
  setEnabled = (enabled) => {
    this.enabled = enabled;
    this.saveRemindersToStorage();
  };

  @action
  setNotificationTime = (time) => {
    this.notificationTime = time;
    this.saveRemindersToStorage();
  };

  @action
  addReminder = () => {

  };

  @action 
  removeReminder = (reminderId) => {};

  @action
  checkDeadlineReminders = (tasks) => {};

  @action
  setupDailyReminder = () => {};

  @action
  sendDailyDigest = () => {};

  sheduleNotification = (reminder) => {};

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

  @action
  loadRemindersFromStorage = () => {
    const saved = localStorage.getItem('app-reminders');

    if (saved) {
      const { reminders, enabled, notificationTime } = JSON.parse(saved);

      this.reminders = reminders || [];
      this.enabled = enabled !== false;
      this.notificationTime = notificationTime || '09:00'
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

  @computed
  get upcomingReminders() {
    this.reminders.slice(0, 5); // Ближайшие 5 уведомлений
  }
}

export default ReminderStore;
