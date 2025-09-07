export const AgentType = {
  MARKETING: "marketing",
  PRODUCT: "product",
  LEGAL: "legal",
  VERIFIER: "verifier",
};

export type AgentType = (typeof AgentType)[keyof typeof AgentType];

export const AGENT_CONVERSATION_HEADER_TEXT = "Agent Conversations";

export const AGENT_CONVERSATION_DESCRIPTION_TEXT =
  "Multiple agent conversations running simultaneously";

export const AGENT_CONVERSATION_SELECT_TEXT = "Select conversation to view";

export const AGENT_CONVERSATION_MARKETING_VERIFIER_TEXT =
  "Marketing strategy analysis and verification";
export const AGENT_CONVERSATION_LEGAL_VERIFIER_TEXT =
  "Legal compliance review and verification";
export const AGENT_CONVERSATION_PRODUCT_VERIFIER_TEXT =
  "Product development planning and verification";

export const AGENT_CONVERSATION_STARTING_CONVERSATION_TEXT =
  "Starting conversation...";

export const ConversationType = {
  MARKETING_VERIFIER: "marketing-verifier",
  LEGAL_VERIFIER: "legal-verifier",
  PRODUCT_VERIFIER: "product-verifier",
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export const CONVERSATION_LABELS = {
  [ConversationType.MARKETING_VERIFIER]: "Marketing & Verifier",
  [ConversationType.LEGAL_VERIFIER]: "Legal & Verifier",
  [ConversationType.PRODUCT_VERIFIER]: "Product & Verifier",
} as const;
