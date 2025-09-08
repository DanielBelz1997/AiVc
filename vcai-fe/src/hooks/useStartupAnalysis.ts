import { useState, useCallback, useRef } from "react";
import { useWebSocket, WebSocketMessage } from "./useWebSocket";
import { backendApi, StartupAnalysisRequest } from "@/services/backendApi";
import type { ConversationMessage } from "@/types/agentMessage";
import type { ConversationResults } from "@/types/summaryReport";

export interface AnalysisState {
  conversationId: string | null;
  status:
    | "idle"
    | "starting"
    | "analyzing"
    | "verifying"
    | "summarizing"
    | "completed"
    | "error";
  currentPhase: number;
  conversations: {
    marketing: ConversationMessage[];
    product: ConversationMessage[];
    legal: ConversationMessage[];
    verifier: ConversationMessage[];
    summary: ConversationMessage[];
  };
  typingIndicators: Record<string, boolean>;
  finalReport: any | null;
  error: string | null;
  progress: {
    specialistAnalysis: boolean;
    verification: boolean;
    summary: boolean;
  };
}

export interface UseStartupAnalysisReturn {
  state: AnalysisState;
  startAnalysis: (request: StartupAnalysisRequest) => Promise<void>;
  resetAnalysis: () => void;
  isConnected: boolean;
  connectionError: string | null;
}

const initialState: AnalysisState = {
  conversationId: null,
  status: "idle",
  currentPhase: 0,
  conversations: {
    marketing: [],
    product: [],
    legal: [],
    verifier: [],
    summary: [],
  },
  typingIndicators: {},
  finalReport: null,
  error: null,
  progress: {
    specialistAnalysis: false,
    verification: false,
    summary: false,
  },
};

export const useStartupAnalysis = (): UseStartupAnalysisReturn => {
  const [state, setState] = useState<AnalysisState>(initialState);
  const conversationIdRef = useRef<string | null>(null);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log("Received WebSocket message:", message);

    setState((prevState) => {
      const newState = { ...prevState };

      switch (message.type) {
        case "connection_established":
          console.log("WebSocket connection established");
          break;

        case "conversation_status":
          const status = message.status;
          let newPhase = prevState.currentPhase;
          let newProgress = { ...prevState.progress };

          switch (status) {
            case "started":
              newState.status = "starting";
              break;
            case "specialist_analysis":
              newState.status = "analyzing";
              newPhase = 1;
              break;
            case "verification":
              newState.status = "verifying";
              newPhase = 2;
              newProgress.specialistAnalysis = true;
              break;
            case "summary_generation":
              newState.status = "summarizing";
              newPhase = 3;
              newProgress.verification = true;
              break;
            case "completed":
              newState.status = "completed";
              newProgress.summary = true;
              if (message.metadata?.report) {
                newState.finalReport = message.metadata.report;
              }
              break;
            case "error":
              newState.status = "error";
              newState.error = message.metadata?.message || "An error occurred";
              break;
          }

          newState.currentPhase = newPhase;
          newState.progress = newProgress;
          break;

        case "typing_indicator":
          const agentType = message.agent_type || "unknown";
          newState.typingIndicators = {
            ...prevState.typingIndicators,
            [agentType]: message.is_typing || false,
          };
          break;

        case "agent_message":
          const agent = message.agent_type;
          if (agent && message.message) {
            const messageObj: ConversationMessage = {
              id: `${agent}-${Date.now()}`,
              agent: agent as any,
              message: message.message,
              avatarFallback: getAgentAvatar(agent),
              side: agent === "verifier" ? "right" : "left",
            };

            if (agent in newState.conversations) {
              newState.conversations[
                agent as keyof typeof newState.conversations
              ] = [
                ...newState.conversations[
                  agent as keyof typeof newState.conversations
                ],
                messageObj,
              ];
            }
          }
          break;

        case "verification_start":
          if (message.agent_type === "verifier" && message.message) {
            const messageObj: ConversationMessage = {
              id: `verifier-start-${Date.now()}`,
              agent: "verifier",
              message: message.message,
              avatarFallback: "VER",
              side: "right",
            };
            newState.conversations.verifier = [
              ...newState.conversations.verifier,
              messageObj,
            ];
          }
          break;

        case "verification_result":
          if (message.agent_type === "verifier" && message.message) {
            const specialistType = message.metadata?.specialist_type;
            const messageObj: ConversationMessage = {
              id: `verifier-result-${specialistType}-${Date.now()}`,
              agent: "verifier",
              message: message.message,
              avatarFallback: "VER",
              side: "right",
            };
            newState.conversations.verifier = [
              ...newState.conversations.verifier,
              messageObj,
            ];
          }
          break;

        case "final_report":
          if (message.agent_type === "summary" && message.message) {
            const messageObj: ConversationMessage = {
              id: `summary-final-${Date.now()}`,
              agent: "summary",
              message: message.message,
              avatarFallback: "SUM",
              side: "left",
            };
            newState.conversations.summary = [
              ...newState.conversations.summary,
              messageObj,
            ];

            if (message.metadata?.structured_report) {
              newState.finalReport = message.metadata.structured_report;
            }
          }
          break;

        default:
          console.log("Unknown message type:", message.type);
      }

      return newState;
    });
  }, []);

  const { isConnected, connectionError, disconnect } = useWebSocket({
    url: conversationIdRef.current
      ? backendApi.getWebSocketUrl(conversationIdRef.current)
      : "",
    onMessage: handleWebSocketMessage,
    onError: (error) => {
      console.error("WebSocket error:", error);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "WebSocket connection failed",
      }));
    },
    onOpen: () => {
      console.log("WebSocket connection opened");
    },
    onClose: () => {
      console.log("WebSocket connection closed");
    },
  });

  const startAnalysis = useCallback(async (request: StartupAnalysisRequest) => {
    try {
      setState((prev) => ({ ...prev, status: "starting", error: null }));

      // Start the analysis on the backend
      const response = await backendApi.startAnalysis(request);

      conversationIdRef.current = response.conversation_id;

      setState((prev) => ({
        ...prev,
        conversationId: response.conversation_id,
        status: "analyzing",
      }));

      console.log("Analysis started:", response);
    } catch (error) {
      console.error("Failed to start analysis:", error);
      setState((prev) => ({
        ...prev,
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to start analysis",
      }));
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    disconnect();
    conversationIdRef.current = null;
    setState(initialState);
  }, [disconnect]);

  return {
    state,
    startAnalysis,
    resetAnalysis,
    isConnected,
    connectionError,
  };
};

function getAgentAvatar(agentType: string): string {
  switch (agentType) {
    case "marketing":
      return "MKT";
    case "product":
      return "PRD";
    case "legal":
      return "LEG";
    case "verifier":
      return "VER";
    case "summary":
      return "SUM";
    default:
      return "AGT";
  }
}
