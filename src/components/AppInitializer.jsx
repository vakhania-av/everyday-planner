import { observer } from "mobx-react-lite";
import { useAuthStore } from "../hooks/useStores";
import { useEffect } from "react";
import LoadingSpinner from "./Layout/LoadingSpinner";

const AppInitializer = observer(({ children }) => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Проверка аутентификации при монтировании
    authStore.initializeAuth();
  }, [authStore]);

  if (authStore.loading) {
    return <LoadingSpinner message="Authorization checking..." />;
  }

  return children;
});

export default AppInitializer;
