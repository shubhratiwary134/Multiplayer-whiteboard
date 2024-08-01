import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuthStore from 'src/storage/authStore';

interface ProtectedRouteProps {
  element: React.ComponentType;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/" />}
    />
  );
};

export default ProtectedRoute;
