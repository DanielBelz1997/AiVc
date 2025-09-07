import type { ConversationType } from "@/constants/agentConversation";
import type { ConversationMessage } from "./agentMessage";

export interface ConversationState {
  messages: ConversationMessage[];
  isTyping: boolean;
  currentMessageIndex: number;
  isComplete: boolean;
}

export type ConversationStates = {
  [key in ConversationType]: ConversationState;
};
