import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));
const AgentConversationPage = lazy(() => import("@/pages/AgentConversation"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/agents", element: <AgentConversationPage /> },
];
