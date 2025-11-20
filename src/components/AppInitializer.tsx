import { observer } from "mobx-react-lite";
import { PropsWithChildren, useEffect } from "react";

import LoadingSpinner from "./Layout/LoadingSpinner";

import { useAuthStore } from "../hooks/useStores";

const AppInitializer = observer(({ children }: PropsWithChildren) => {
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
