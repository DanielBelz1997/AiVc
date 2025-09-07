import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ConversationMessage } from "@/types/agentMessage";
import { ConversationType } from "@/constants/agentConversation";
import { getConversationMessages } from "@/constants/conversationData";
import type {
  ConversationState,
  ConversationStates,
} from "@/types/multiConversation";
import type { ConversationResults } from "@/types/summaryReport";

interface UseMultiConversationProps {
  input: string;
}

const initialConversationStates: ConversationState = {
  messages: [],
  isTyping: false,
  currentMessageIndex: 0,
  isComplete: false,
};

export const useMultiConversation = ({ input }: UseMultiConversationProps) => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType>(ConversationType.MARKETING_VERIFIER);

  const [conversations, setConversations] = useState<ConversationStates>({
    [ConversationType.MARKETING_VERIFIER]: initialConversationStates,
    [ConversationType.LEGAL_VERIFIER]: initialConversationStates,
    [ConversationType.PRODUCT_VERIFIER]: initialConversationStates,
  });

  // Store conversation data for each type
  const conversationData = useRef<{
    [key in ConversationType]: Omit<ConversationMessage, "id">[];
  }>({
    [ConversationType.MARKETING_VERIFIER]: getConversationMessages(
      ConversationType.MARKETING_VERIFIER,
      input
    ),
    [ConversationType.LEGAL_VERIFIER]: getConversationMessages(
      ConversationType.LEGAL_VERIFIER,
      input
    ),
    [ConversationType.PRODUCT_VERIFIER]: getConversationMessages(
      ConversationType.PRODUCT_VERIFIER,
      input
    ),
  });

  const addMessageToConversation = (
    conversationType: ConversationType,
    message: Omit<ConversationMessage, "id">,
    messageIndex: number
  ) => {
    setConversations((prev) => ({
      ...prev,
      [conversationType]: {
        ...prev[conversationType],
        messages: [
          ...prev[conversationType].messages,
          {
            id: `${conversationType}-message-${messageIndex}`,
            ...message,
          },
        ],
        isTyping: false,
        currentMessageIndex: messageIndex + 1,
        isComplete:
          messageIndex + 1 >= conversationData.current[conversationType].length,
      },
    }));
  };

  const setTypingForConversation = (
    conversationType: ConversationType,
    isTyping: boolean
  ) => {
    setConversations((prev) => ({
      ...prev,
      [conversationType]: {
        ...prev[conversationType],
        isTyping,
      },
    }));
  };

  // Function to extract conversation results
  const extractConversationResults = (): ConversationResults => {
    const marketingResults = conversations[
      ConversationType.MARKETING_VERIFIER
    ].messages
      .filter((msg) => msg.agent === "marketing")
      .map((msg) => msg.message);

    const legalResults = conversations[ConversationType.LEGAL_VERIFIER].messages
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
  };

  // Check if all conversations are complete
  const allConversationsComplete = Object.values(conversations).every(
    (conv) => conv.isComplete
  );

  // Navigate to summary when all conversations are done
  useEffect(() => {
    if (
      allConversationsComplete &&
      Object.values(conversations).some((conv) => conv.messages.length > 0)
    ) {
      // Small delay to allow user to see completion status
      const timeout = setTimeout(() => {
        const conversationResults = extractConversationResults();
        navigate("/summary", {
          state: { conversationResults },
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [allConversationsComplete, conversations, navigate, input]);

  useEffect(() => {
    const conversationIntervals: { [key: string]: NodeJS.Timeout[] } = {};

    const startConversation = (conversationType: ConversationType) => {
      const messages = conversationData.current[conversationType];
      const intervals: NodeJS.Timeout[] = [];

      messages.forEach((message, messageIndex) => {
        const messageDelay = 3000 + messageIndex * 2500 + Math.random() * 1000; // 3s base + 2.5s per message + random

        const typingTimeout = setTimeout(() => {
          setTypingForConversation(conversationType, true);

          const messageTimeout = setTimeout(() => {
            addMessageToConversation(conversationType, message, messageIndex);
          }, 1500 + Math.random() * 1000); // 1.5-2.5s typing delay

          intervals.push(messageTimeout);
        }, messageDelay);

        intervals.push(typingTimeout);
      });

      conversationIntervals[conversationType] = intervals;
    };

    // Start all three conversations independently
    startConversation(ConversationType.MARKETING_VERIFIER);
    startConversation(ConversationType.LEGAL_VERIFIER);
    startConversation(ConversationType.PRODUCT_VERIFIER);

    // Cleanup function
    return () => {
      Object.values(conversationIntervals).forEach((intervals) => {
        intervals.forEach((interval) => clearTimeout(interval));
      });
    };
  }, [input]);

  return {
    selectedConversation,
    setSelectedConversation,
    conversations,
    conversationData: conversationData.current,
  };
};
