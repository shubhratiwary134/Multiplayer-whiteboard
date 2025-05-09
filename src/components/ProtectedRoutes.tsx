import { RedirectToSignUp, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { ReactNode } from "react";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
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
