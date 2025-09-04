import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
];
