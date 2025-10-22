import { action, makeObservable, observable } from "mobx";

class UiStore {
  @observable toastQueue = [];
  @observable sidebarOpen = false;
  @observable currentTheme = 'light';

  constructor() {
    makeObservable(this);
  }

  @action
  addToast = (message, severity = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, severity, duration };

    this.toastQueue.push(newToast);
    // Автоматическое удаление через указанный duration
    setTimeout(() => this.removeToast(id), duration);
  };

  @action
  removeToast = (id) => {
    this.toastQueue = this.toastQueue.filter((toast) => toast.id !== id);
  };

  @action
  setSidebarOpen = (open) => {
    this.sidebarOpen = open;
  };

  @action
  setTheme = (theme) => {
    this.currentTheme = theme;
  };
}

export default UiStore;
