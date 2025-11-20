import { ThemeType } from "@/types/theme";
import { IToast, ToastSeverity } from "@/types/toast";
import { action, makeObservable, observable } from "mobx";

class UiStore {
  @observable toastQueue: IToast[] = [];
  @observable sidebarOpen: boolean = false;
  @observable currentTheme: ThemeType = 'light';

  private toastTimeouts = new Map<string, number>();
  private DEFAULT_DURATION: number = 4000;

  constructor() {
    makeObservable(this);
  }

  @action
  addToast = (message: string, severity: ToastSeverity = 'success', duration: number = this.DEFAULT_DURATION): void => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: IToast = { id, message, severity, duration };

    this.toastQueue.push(newToast);

    // Автоматическое удаление через указанный duration
    const timeoutId = window.setTimeout(() => {
      this.removeToast(id);
      this.toastTimeouts.delete(id);
    }, duration);

    this.toastTimeouts.set(id, timeoutId);
  };

  @action
  removeToast = (id: string): void => {
    const timeoutId = this.toastTimeouts.get(id);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.toastTimeouts.delete(id);
    }

    this.toastQueue = this.toastQueue.filter((toast) => toast.id !== id);
  };

  @action
  setSidebarOpen = (open: boolean): void => {
    this.sidebarOpen = open;
  };

  @action
  setTheme = (theme: ThemeType): void => {
    this.currentTheme = theme;
  };
}

export default UiStore;
