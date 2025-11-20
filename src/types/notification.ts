export interface INotification {
  id: number;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 'task_completed' | 'task_created' | 'task_updated' | 'task_deleted' | 'task_overdue';
