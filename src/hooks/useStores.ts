import { useStore } from "../stores";

export const useStores = () => {
  return useStore();
};

export const useAuthStore = () => {
  const { authStore } = useStore();

  return authStore;
};

export const useUiStore = () => {
  const { uiStore } = useStore();

  return uiStore;
};

export const useNotificationStore = () => {
  const { notificationStore } = useStore();

  return notificationStore;
};

export const useTaskStore = () => {
  const { taskStore } = useStore();

  return taskStore;
};

export const useThemeStore = () => {
  const { themeStore } = useStore();

  return themeStore;
};

export const useReminderStore = () => {
  const { reminderStore } = useStore();

  return reminderStore;
};

export const useGoalStore = () => {
  const { goalStore } = useStore();

  return goalStore;
};