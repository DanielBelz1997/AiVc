import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));
const AgentConversationPage = lazy(() => import("@/pages/AgentConversation"));
const SummaryReportPage = lazy(() => import("@/pages/SummaryReport"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/agents", element: <AgentConversationPage /> },
  { path: "/summary", element: <SummaryReportPage /> },
];
