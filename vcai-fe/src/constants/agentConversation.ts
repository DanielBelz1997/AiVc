export const AgentType = {
  MARKETING: "marketing",
  PRODUCT: "product",
  LEGAL: "legal",
  VERIFIER: "verifier",
};

export type AgentType = (typeof AgentType)[keyof typeof AgentType];

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
