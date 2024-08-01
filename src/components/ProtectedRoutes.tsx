import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../storage/authStore';

interface ProtectedRouteProps {
  element: React.ReactElement;
 
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

export default ProtectedRoutes;
