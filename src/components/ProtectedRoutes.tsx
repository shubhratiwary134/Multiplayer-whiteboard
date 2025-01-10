import { RedirectToSignUp, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoutes = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);
  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }
  if (!isSignedIn) {
    return <RedirectToSignUp />;
  }
  return children;
};

export default ProtectedRoutes;
