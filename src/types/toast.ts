export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface IToast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration: number;
}

