import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ConversationMessage } from "@/types/agentMessage";
import { ConversationType } from "@/constants/agentConversation";
import type {
  ConversationState,
  ConversationStates,
} from "@/types/multiConversation";
import type { ConversationResults } from "@/types/summaryReport";
import { useStartupAnalysis } from "./useStartupAnalysis";

interface UseRealTimeConversationsProps {
  input: string;
  conversationId?: string;
  usingBackend?: boolean;
}

const initialConversationStates: ConversationState = {
  messages: [],
  isTyping: false,
  currentMessageIndex: 0,
  isComplete: false,
};

export const useRealTimeConversations = ({
  input,
  conversationId,
  usingBackend = false,
}: UseRealTimeConversationsProps) => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType>(ConversationType.MARKETING_VERIFIER);

  const [conversations, setConversations] = useState<ConversationStates>({
    [ConversationType.MARKETING_VERIFIER]: initialConversationStates,
    [ConversationType.LEGAL_VERIFIER]: initialConversationStates,
    [ConversationType.PRODUCT_VERIFIER]: initialConversationStates,
  });

  const { state: analysisState, startAnalysis } = useStartupAnalysis();
  const isUsingBackendRef = useRef(usingBackend);

  // Update conversations based on real-time data from backend
  useEffect(() => {
    if (!isUsingBackendRef.current || !analysisState.conversationId) return;

    // Map backend conversations to frontend conversation types
    const backendToFrontendMapping = {
      marketing: ConversationType.MARKETING_VERIFIER,
      product: ConversationType.PRODUCT_VERIFIER,
      legal: ConversationType.LEGAL_VERIFIER,
    };

    setConversations((prev) => {
      const newConversations = { ...prev };

      // Update each conversation type with backend data
      Object.entries(backendToFrontendMapping).forEach(
        ([backendType, frontendType]) => {
          const backendMessages =
            analysisState.conversations[
              backendType as keyof typeof analysisState.conversations
            ] || [];

          // Convert backend messages to frontend format
          const frontendMessages = backendMessages.map(
            (msg) =>
              ({
                ...msg,
                side: msg.agent === "verifier" ? "right" : "left",
              } as ConversationMessage)
          );

          // Add verifier messages for this conversation type
          const verifierMessages = analysisState.conversations.verifier
            .filter((msg) => msg.message.toLowerCase().includes(backendType))
            .map((msg) => ({
              ...msg,
              side: "right" as const,
            }));

          const allMessages = [...frontendMessages, ...verifierMessages].sort(
            (a, b) =>
              parseInt(a.id.split("-").pop() || "0") -
              parseInt(b.id.split("-").pop() || "0")
          );

          newConversations[frontendType] = {
            messages: allMessages,
            isTyping: analysisState.typingIndicators[backendType] || false,
            currentMessageIndex: allMessages.length,
            isComplete:
              analysisState.status === "completed" ||
              analysisState.progress.verification,
          };
        }
      );

      return newConversations;
    });
  }, [analysisState]);

  // Start analysis if using backend and not already started
  useEffect(() => {
    if (
      isUsingBackendRef.current &&
      conversationId &&
      !analysisState.conversationId
    ) {
      startAnalysis({ prompt: input });
    }
  }, [conversationId, input, startAnalysis, analysisState.conversationId]);

  // Function to extract conversation results for navigation
  const extractConversationResults = useCallback((): ConversationResults => {
    if (isUsingBackendRef.current) {
      // Extract from backend analysis state
      const marketingResults = analysisState.conversations.marketing
        .filter((msg) => msg.agent === "marketing")
        .map((msg) => msg.message);

      const legalResults = analysisState.conversations.legal
        .filter((msg) => msg.agent === "legal")
        .map((msg) => msg.message);

      const productResults = analysisState.conversations.product
        .filter((msg) => msg.agent === "product")
        .map((msg) => msg.message);

      return {
        marketingResults,
        legalResults,
        productResults,
        userInput: input,
      };
    } else {
      // Extract from frontend simulation (fallback)
      const marketingResults = conversations[
        ConversationType.MARKETING_VERIFIER
      ].messages
        .filter((msg) => msg.agent === "marketing")
        .map((msg) => msg.message);

      const legalResults = conversations[
        ConversationType.LEGAL_VERIFIER
      ].messages
        .filter((msg) => msg.agent === "legal")
        .map((msg) => msg.message);

      const productResults = conversations[
        ConversationType.PRODUCT_VERIFIER
      ].messages
        .filter((msg) => msg.agent === "product")
        .map((msg) => msg.message);

      return {
        marketingResults,
        legalResults,
        productResults,
        userInput: input,
      };
    }
  }, [conversations, analysisState, input]);

  // Check if all conversations are complete
  const allConversationsComplete = isUsingBackendRef.current
    ? analysisState.status === "completed"
    : Object.values(conversations).every((conv) => conv.isComplete);

  // Navigate to summary when all conversations are done
  useEffect(() => {
    if (allConversationsComplete) {
      // Small delay to allow user to see completion status
      const timeout = setTimeout(() => {
        if (isUsingBackendRef.current && analysisState.finalReport) {
          // Navigate with backend report
          navigate("/summary", {
            state: {
              conversationResults: extractConversationResults(),
              backendReport: analysisState.finalReport,
              usingBackend: true,
            },
          });
        } else if (
          !isUsingBackendRef.current &&
          Object.values(conversations).some((conv) => conv.messages.length > 0)
        ) {
          // Navigate with simulated data
          const conversationResults = extractConversationResults();
          navigate("/summary", {
            state: { conversationResults },
          });
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [
    allConversationsComplete,
    conversations,
    navigate,
    input,
    analysisState.finalReport,
    extractConversationResults,
  ]);

  return {
    selectedConversation,
    setSelectedConversation,
    conversations,
    analysisState,
    isUsingBackend: isUsingBackendRef.current,
    connectionStatus: {
      isConnected:
        analysisState.status !== "idle" && analysisState.status !== "error",
      error: analysisState.error,
    },
  };
};
