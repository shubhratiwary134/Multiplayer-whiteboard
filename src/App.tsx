import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './storage/authStore';
import LoadingScreen from './components/LoadingScreen'; 

const InitialPage = React.lazy(() => import('./components/InitialPage'));
const Room = React.lazy(() => import('./components/Room'));
const ProtectedRoutes = React.lazy(() => import('./components/ProtectedRoutes'));

const App: React.FC = () => {
  const { initKeycloak, isAuthenticated, error } = useAuthStore();

  useEffect(() => {
    initKeycloak();
  }, [initKeycloak]);

  if (error) {
    return <div>Error initializing authentication: {error}</div>;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route
            path="/room/:roomID"
            element={<ProtectedRoutes element={<Room />} />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
