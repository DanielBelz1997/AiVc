import { AIAgentWorkflow } from "@/components/ai-agents-loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { WorkflowState } from "@/hooks/useAgentsFlow";
import { NorthernLightsBackground } from "@/components/ui/shadcn-io/northern-lights-background";
import {
  NORTHERN_LIGHTS_AMPLITUDE,
  NORTHERN_LIGHTS_BLEND,
  NORTHERN_LIGHTS_COLOR_STOPS,
  NORTHERN_LIGHTS_SPEED,
} from "@/constants";

export default function AgentFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationState = location.state as {
    input: string;
  } | null;

  const [input, setInput] = useState(navigationState?.input || "");
  const [workflow, setWorkflow] = useState<WorkflowState>({
    userPrompt: "",
    responses: [],
    currentAgent: null,
    isComplete: false,
    verifierConclusion: null,
  });
  const [editText, setEditText] = useState("");
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const workflowStarted = useRef(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // Start the workflow when component mounts
  useEffect(() => {
    if (navigationState?.input && !workflowStarted.current) {
      workflowStarted.current = true;
      startWorkflow();
    }
  }, [navigationState?.input]);

  const startWorkflow = async () => {
    if (!navigationState?.input?.trim()) return;

    // Initialize workflow
    setWorkflow({
      userPrompt: navigationState.input,
      responses: [],
      currentAgent: "marketing",
      isComplete: false,
      verifierConclusion: null,
    });

    // Wait a bit before starting
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Process agents sequentially
    const agentOrder = ["marketing", "product", "legal"];

    for (const agent of agentOrder) {
      await processAgent(agent);
    }

    // Final verifier conclusion
    await processVerifier();
  };

  const processAgent = async (agent: string) => {
    const agentId = `${agent}-${Date.now()}`;

    // Show thinking state
    setWorkflow((prev) => ({
      ...prev,
      currentAgent: agent,
      responses: [
        ...prev.responses,
        {
          id: agentId,
          agent: agent as any,
          text: "",
          status: "thinking",
          timestamp: Date.now(),
        },
      ],
    }));

    // Thinking time (2-4 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 2000)
    );

    // Update to responding state
    setWorkflow((prev) => ({
      ...prev,
      responses: prev.responses.map((r) =>
        r.id === agentId ? { ...r, status: "responding" as const } : r
      ),
    }));

    // Generate response
    const responseText = await generateAgentResponse(agent);

    // Responding time (1-2 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    // Show final response
    setWorkflow((prev) => ({
      ...prev,
      responses: prev.responses.map((r) =>
        r.id === agentId
          ? {
              ...r,
              text: responseText,
              status: "complete" as const,
              isEditable: true,
            }
          : r
      ),
    }));

    // Pause before next agent
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const processVerifier = async () => {
    setWorkflow((prev) => ({ ...prev, currentAgent: "verifier" }));

    // Verifier thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 1000)
    );

    const conclusion = await generateAgentResponse("verifier");

    setWorkflow((prev) => ({
      ...prev,
      currentAgent: null,
      isComplete: true,
      verifierConclusion: conclusion,
    }));
  };

  const generateAgentResponse = async (agent: string): Promise<string> => {
    // No additional delay here since we already have delays in processAgent
    const userInput = navigationState?.input || "";

    const responses = {
      marketing: [
        `Interesting request! From a marketing perspective, "${userInput}" has strong market potential. I'm seeing 73% interest in this type of solution from our target demographic. We should focus on the value proposition of efficiency and cost savings to maximize appeal.`,
        `Great idea! This aligns perfectly with current market trends. For "${userInput}", we should emphasize the competitive advantage and unique selling points. The messaging should focus on ROI and user benefits to drive adoption.`,
        `Love this concept! "${userInput}" presents an excellent opportunity for market differentiation. I suggest positioning this as an innovative solution that addresses key pain points in the industry. The timing couldn't be better!`,
      ],
      product: [
        `Thanks for that market analysis! Building on those insights, I agree on the potential for "${userInput}". From a product standpoint, we need to ensure scalability and user-friendly design. The technical feasibility looks promising with our current infrastructure.`,
        `Great points about the marketing strategy! For the product requirements of "${userInput}", we should include robust analytics, seamless integration capabilities, and mobile-first design. We can definitely leverage our existing API framework for faster development.`,
        `I'm aligned with the marketing direction! The product roadmap for "${userInput}" should prioritize core functionality first, then expand based on user feedback. I recommend an MVP approach with iterative improvements to get to market quickly.`,
      ],
      legal: [
        `Reviewing both the marketing and product perspectives on "${userInput}", I need to highlight some compliance considerations. We must ensure data privacy regulations are met, especially GDPR and CCPA requirements. The terms of service will definitely need updates.`,
        `Good insights from the team! From a legal standpoint, the proposed approach for "${userInput}" has manageable risk levels. We should implement proper user consent mechanisms and data retention policies. I recommend a legal review before launch to be safe.`,
        `Thanks for the thorough analysis! The regulatory landscape supports this initiative for "${userInput}". However, we need clear documentation for liability protection and intellectual property considerations. Let's make sure we're covered on all fronts.`,
      ],
      verifier: [
        `Excellent collaboration, team! After analyzing all agent responses regarding "${userInput}", I've identified high accuracy levels with no significant hallucinations detected. The marketing projections align with industry data, product feasibility is technically sound, and legal considerations are comprehensive.`,
        `Great work everyone! Cross-referencing the agent responses about "${userInput}" with factual databases shows 94% accuracy. The recommendations are well-grounded and complement each other effectively. No contradictions or false claims detected.`,
        `Outstanding analysis! Verification complete for "${userInput}": All agent responses demonstrate logical consistency and factual accuracy. The collaborative analysis provides a solid foundation for decision-making. You're good to proceed!`,
      ],
    };

    const agentResponses = responses[agent as keyof typeof responses];
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleEditResponse = (responseId: string) => {
    const response = workflow.responses.find((r) => r.id === responseId);
    if (response) {
      setEditingResponse(responseId);
      setEditText(response.text);
    }
  };

  if (!location.state) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black">
      <NorthernLightsBackground
        className="fixed inset-0"
        colorStops={NORTHERN_LIGHTS_COLOR_STOPS}
        amplitude={NORTHERN_LIGHTS_AMPLITUDE}
        blend={NORTHERN_LIGHTS_BLEND}
        speed={NORTHERN_LIGHTS_SPEED}
      />
      <div className="relative z-10">
        <AIAgentWorkflow
          input={input}
          setInput={setInput}
          workflow={workflow}
          handleEditResponse={handleEditResponse}
          editText={editText}
          setEditText={setEditText}
          editingResponse={editingResponse}
          setEditingResponse={setEditingResponse}
        />
      </div>
    </div>
  );
}
