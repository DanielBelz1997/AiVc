export interface AgentResponse {
  id: string;
  agent: "marketing" | "product" | "legal" | "verifier";
  text: string;
  status: "thinking" | "responding" | "complete" | "corrected";
  isEditable?: boolean;
  timestamp: number;
}

export interface WorkflowState {
  userPrompt: string;
  responses: AgentResponse[];
  currentAgent: string | null;
  isComplete: boolean;
  verifierConclusion: string | null;
}

export interface UseAgentsFlowProps {}

export const useAgentsFlow = () => {
  const agents = {
    marketing: {
      name: "Marketing Strategist",
      role: "Marketing Strategist",
      avatar: "SC",
      color: "bg-blue-600 text-white",
      description: "Analyzes market trends and user engagement",
    },
    product: {
      name: "Product Manager",
      role: "Product Manager",
      avatar: "AR",
      color: "bg-green-600 text-white",
      description: "Focuses on product features and user experience",
    },
    legal: {
      name: "Legal Advisor",
      role: "Legal Advisor",
      avatar: "JK",
      color: "bg-purple-600 text-white",
      description: "Ensures compliance and risk management",
    },
    verifier: {
      name: "AI Verifier",
      role: "AI Verifier",
      avatar: "DM",
      color: "bg-orange-600 text-white",
      description: "Validates responses and prevents hallucinations",
    },
  };

  const TypingIndicator = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
    </div>
  );

  return {
    agents,
    TypingIndicator,
  };
};
