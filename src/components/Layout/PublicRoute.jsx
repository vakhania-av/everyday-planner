import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from './LoadingSpinner';

export default function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';

    return <Navigate to={from} replace />;
  }

  return children;
}
