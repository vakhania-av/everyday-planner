import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';
import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../hooks/useStores";

const PrivateRoute = observer(({ children }) => {
  const { currentUser, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <LoadingSpinner message="Checking authentication..." />

  if (!currentUser ) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children;
});

export default PrivateRoute;
