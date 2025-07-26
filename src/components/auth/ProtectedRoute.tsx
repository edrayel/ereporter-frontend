import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'supervisor' | 'agent';
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    // Allow admin to access all routes
    if (user.role !== 'admin') {
      return <Navigate to='/app/unauthorized' replace />;
    }
  }

  // Check permission requirement
  if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
    return <Navigate to='/app/unauthorized' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
