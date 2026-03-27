import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowGuest?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowGuest = false }) => {
  const { isAuthenticated, isGuest } = useAuth();

  if (!isAuthenticated && !(allowGuest && isGuest)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
