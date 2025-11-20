export type ReminderType = 'deadline' | '24h' | '1h';

export interface IReminder {
  id: string;
  taskId: number;
  taskTitle: string;
  deadline: string; // ISO string
  reminderType: ReminderType;
  createdAt: string;
  notifyAt?: number;
}
