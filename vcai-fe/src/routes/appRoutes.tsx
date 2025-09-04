import { Route, Routes } from "react-router-dom";

import { routes } from "@/routes";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
