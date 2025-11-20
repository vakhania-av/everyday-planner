import { createContext, useContext } from "react";

import AuthStore from "./AuthStore";
import UiStore from "./UiStore";
import NotificationStore from "./NotificationStore";
import TaskStore from "./TaskStore";
import ThemeStore from "./ThemeStore";
import ReminderStore from "./ReminderStore";
import GoalStore from "./GoalStore";

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  themeStore: ThemeStore;
  reminderStore: ReminderStore;
  goalStore: GoalStore;
  notificationStore: NotificationStore;
  taskStore: TaskStore;

  constructor() {
    this.authStore = new AuthStore();
    this.uiStore = new UiStore();
    this.themeStore = new ThemeStore();
    this.reminderStore = new ReminderStore();
    this.goalStore = new GoalStore();

    this.notificationStore = new NotificationStore(this);
    this.taskStore = new TaskStore(this);
  }
}

const rootStore = new RootStore();
const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = StoreContext.Provider;

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return store;
};


export default rootStore;
