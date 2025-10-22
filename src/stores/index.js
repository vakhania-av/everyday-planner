import { createContext, useContext } from "react";
import AuthStore from "./AuthStore";
import UiStore from "./UiStore";
import NotificationStore from "./NotificationStore";
import TaskStore from "./TaskStore";

class RootStore {
  constructor() {
    this.authStore = new AuthStore();
    this.uiStore = new UiStore();
    this.notificationStore = new NotificationStore(this.authStore);
    this.taskStore = new TaskStore();
  }
}

const rootStore = new RootStore();
const StoreContext = createContext(rootStore);

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return store;
};

export const StoreProvider = StoreContext.Provider;
export default rootStore;
