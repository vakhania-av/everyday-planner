import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';
import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../hooks/useStores";
import { PropsWithChildren } from "react";

const PrivateRoute = observer(({ children }: PropsWithChildren) => {
  const { currentUser, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children;
});

export default PrivateRoute;
