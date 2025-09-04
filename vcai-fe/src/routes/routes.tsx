import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));
const AgentFlowPage = lazy(() => import("@/pages/AgentFlow"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/agents", element: <AgentFlowPage /> },
];
