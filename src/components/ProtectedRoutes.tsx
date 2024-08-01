import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../storage/authStore';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, keycloak } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    keycloak?.login();
    return <div>Redirecting to login...</div>;
  }

  return element;
};

export default ProtectedRoutes;
