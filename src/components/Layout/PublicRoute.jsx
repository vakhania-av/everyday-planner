import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';
import { observer } from "mobx-react-lite";
import { useAuthStore } from "../../hooks/useStores";

const PublicRoute = observer(({ children }) => {
  const { currentUser, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';

    return <Navigate to={from} replace />;
  }

  return children;
});

export default PublicRoute;
