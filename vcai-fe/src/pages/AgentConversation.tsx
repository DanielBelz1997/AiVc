import { SimpleAgentConversation } from "@/components/agent-conversation";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AgentConversation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationState = location.state as {
    input: string;
  } | null;

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SimpleAgentConversation input={navigationState?.input || ""} />
    </div>
  );
}
