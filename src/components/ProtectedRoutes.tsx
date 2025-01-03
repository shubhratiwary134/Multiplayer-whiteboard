import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return <Navigate to="/Sign-In" />;
  }
  return children;
};

export default ProtectedRoutes;
