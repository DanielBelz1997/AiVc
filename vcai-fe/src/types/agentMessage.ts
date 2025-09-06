import type { AgentType } from "@/constants";

export const AGENT_MESSAGE_STATUS = {
  THINKING: "thinking",
  RESPONDING: "responding",
  COMPLETE: "complete",
  CORRECTED: "corrected",
} as const;

export type AgentMessageStatus =
  (typeof AGENT_MESSAGE_STATUS)[keyof typeof AGENT_MESSAGE_STATUS];

export interface ConversationMessage {
  id: string;
  agent: AgentType;
  message: string;
  avatarFallback: string;
  side: "left" | "right";
}
