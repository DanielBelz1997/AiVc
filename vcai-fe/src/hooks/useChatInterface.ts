import type { AttachedFile } from "@/types";
import { useState } from "react";
import type { WorkflowState } from "./useAgentsFlow";
import { useNavigate } from "react-router-dom";

export interface AgentResponse {
  id: string;
  agent: "marketing" | "product" | "legal" | "verifier";
  text: string;
  status: "thinking" | "responding" | "complete" | "corrected";
  isEditable?: boolean;
  timestamp: number;
}

export const useChatInterface = () => {
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [workflow, setWorkflow] = useState<WorkflowState>({
    userPrompt: "",
    responses: [],
    currentAgent: null,
    isComplete: false,
    verifierConclusion: null,
  });
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;

    navigate("/agents", {
      state: {
        input,
        attachedFiles,
      },
    });

    setTimeout(() => {
      setInput("");
      setAttachedFiles([]);
      setIsLoading(false);
    }, 2000); // Give more time for navigation
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: AttachedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const startWorkflow = async () => {
    if (!input.trim()) return;

    setWorkflow({
      userPrompt: input,
      responses: [],
      currentAgent: "marketing",
      isComplete: false,
      verifierConclusion: null,
    });

    // Process agents sequentially
    const agentOrder = ["marketing", "product", "legal"];
    const newResponses: AgentResponse[] = [];

    for (const agent of agentOrder) {
      // Show thinking state
      setWorkflow((prev) => ({
        ...prev,
        currentAgent: agent,
        responses: [
          ...prev.responses,
          {
            id: `${agent}-${Date.now()}`,
            agent: agent as any,
            text: "",
            status: "thinking",
            timestamp: Date.now(),
          },
        ],
      }));

      // Generate response
      const responseText = await generateAgentResponse(
        agent
        // input,
        // newResponses
      );

      // Update to responding state
      setWorkflow((prev) => ({
        ...prev,
        responses: prev.responses.map((r) =>
          r.agent === agent && r.status === "thinking"
            ? { ...r, status: "responding" as const }
            : r
        ),
      }));

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show final response
      const finalResponse: AgentResponse = {
        id: `${agent}-${Date.now()}`,
        agent: agent as any,
        text: responseText,
        status: "complete",
        isEditable: true,
        timestamp: Date.now(),
      };

      newResponses.push(finalResponse);

      setWorkflow((prev) => ({
        ...prev,
        responses: prev.responses.map((r) =>
          r.agent === agent && r.status === "responding" ? finalResponse : r
        ),
      }));

      // Verifier checks each response
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Final verifier conclusion
    setWorkflow((prev) => ({ ...prev, currentAgent: "verifier" }));

    const conclusion = await generateAgentResponse(
      "verifier"
      // inputPrompt,
      // newResponses
    );

    setWorkflow((prev) => ({
      ...prev,
      currentAgent: null,
      isComplete: true,
      verifierConclusion: conclusion,
    }));
  };

  const generateAgentResponse = async (
    agent: string
    // context: string,
    // previousResponses: AgentResponse[]
  ): Promise<string> => {
    // Simulate AI thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 2000)
    );

    const responses = {
      marketing: [
        `Based on the user's request, I see strong market potential. Our target demographic shows 73% interest in this type of solution. I recommend focusing on the value proposition of efficiency and cost savings.`,
        `From a marketing perspective, this aligns with current market trends. We should emphasize the competitive advantage and unique selling points. The messaging should focus on ROI and user benefits.`,
        `This presents an excellent opportunity for market differentiation. I suggest positioning this as an innovative solution that addresses key pain points in the industry.`,
      ],
      product: [
        `Analyzing Sarah's marketing insights, I agree on the market potential. From a product standpoint, we need to ensure scalability and user-friendly design. The technical feasibility looks promising with our current infrastructure.`,
        `Building on the marketing strategy, the product requirements should include robust analytics, seamless integration capabilities, and mobile-first design. We can leverage our existing API framework.`,
        `The product roadmap should prioritize core functionality first, then expand based on user feedback. I recommend an MVP approach with iterative improvements.`,
      ],
      legal: [
        `Reviewing both marketing and product perspectives, I need to highlight compliance considerations. We must ensure data privacy regulations are met, especially GDPR and CCPA requirements. The terms of service will need updates.`,
        `From a legal standpoint, the proposed approach has manageable risk levels. We should implement proper user consent mechanisms and data retention policies. I recommend a legal review before launch.`,
        `The regulatory landscape supports this initiative. However, we need clear documentation for liability protection and intellectual property considerations.`,
      ],
      verifier: [
        `After analyzing all agent responses, I've identified high accuracy levels with no significant hallucinations detected. The marketing projections align with industry data, product feasibility is technically sound, and legal considerations are comprehensive.`,
        `Cross-referencing the agent responses with factual databases shows 94% accuracy. The recommendations are well-grounded and complement each other effectively. No contradictions or false claims detected.`,
        `Verification complete: All agent responses demonstrate logical consistency and factual accuracy. The collaborative analysis provides a solid foundation for decision-making.`,
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

  return {
    workflow,
    attachedFiles,
    setAttachedFiles,
    handleSubmit,
    handleFileAttach,
    removeFile,
    formatFileSize,
    isLoading,
    setIsLoading,
    startWorkflow,
    handleEditResponse,
    editingResponse,
    editText,
    setEditText,
    setEditingResponse,
    setInput,
    input,
  };
};
