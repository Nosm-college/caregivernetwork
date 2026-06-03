import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, employerOnly = false }) {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'Please sign in to continue.' }} replace />;
  }

  if (employerOnly && profile?.role !== 'employer') {
    return <Navigate to="/" state={{ message: 'Only employers can post jobs.' }} replace />;
  }

  return children;
}
