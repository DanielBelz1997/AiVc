import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  //   useEffect(() => {
  //     const checkAuth = async () => {
  //       if (!isAuthenticated) {
  //         try {
  //           await login();
  //         } catch (error) {
  //           console.error("Authentication failed:", error);
  //         }
  //       }
  //     };

  //     checkAuth();
  //   }, [isAuthenticated, login]);

  if (false) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
