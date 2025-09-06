import type { ConversationMessage } from "@/types/agentMessage";
import { AgentType, ConversationType } from "./agentConversation";

export const getConversationMessages = (
  conversationType: ConversationType,
  input: string
): Omit<ConversationMessage, "id">[] => {
  switch (conversationType) {
    case ConversationType.MARKETING_VERIFIER:
      return [
        {
          agent: AgentType.MARKETING,
          message: `Great idea! "${input}" has strong market potential. I'm seeing excellent opportunities for user engagement and growth. The value proposition is clear and addresses key market needs.`,
          avatarFallback: "MKT",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Thanks for the analysis! I've verified the marketing claims and found them to be well-grounded. The market research data supports the projections, and the strategy aligns with current industry trends. Looking good!`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.MARKETING,
          message: `Perfect! I recommend we focus on the core value propositions: efficiency, cost savings, and user experience. We should target early adopters first, then expand to mainstream market segments.`,
          avatarFallback: "MKT",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Excellent strategy! Cross-referencing with market data confirms this approach has a 85% success rate in similar launches. All marketing claims are factually accurate and the timeline is realistic. You're good to proceed!`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.MARKETING,
          message: `I've also identified three key marketing channels: social media campaigns targeting millennials, partnership with industry influencers, and content marketing through case studies. Budget allocation should be 40% digital, 35% partnerships, 25% content.`,
          avatarFallback: "MKT",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Budget breakdown verified against industry benchmarks. The 40-35-25 split aligns with successful campaigns in similar markets. ROI projections are conservative and achievable. Marketing plan approved for execution.`,
          avatarFallback: "VER",
          side: "right",
        },
      ];

    case ConversationType.LEGAL_VERIFIER:
      return [
        {
          agent: AgentType.LEGAL,
          message: `Reviewing "${input}" from a legal perspective. I need to assess compliance requirements, intellectual property considerations, and potential liability issues. Initial analysis shows some areas that need attention.`,
          avatarFallback: "LEG",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `I've cross-checked the legal analysis against current regulations and case law. The compliance concerns raised are valid and need to be addressed before proceeding. Let me verify the specific requirements.`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.LEGAL,
          message: `Key legal considerations: Data privacy compliance (GDPR/CCPA), terms of service updates, user consent mechanisms, and liability limitations. We'll need explicit user agreements and data processing documentation.`,
          avatarFallback: "LEG",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Legal requirements verified. GDPR Article 6 and CCPA Section 1798.100 apply. Terms of service template found in legal database. All mentioned compliance frameworks are current and enforceable. Proceeding with documentation.`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.LEGAL,
          message: `I recommend implementing a staged compliance approach: Phase 1 - Basic privacy policy and terms, Phase 2 - Advanced consent management, Phase 3 - Full regulatory compliance audit. Timeline: 2-4 weeks per phase.`,
          avatarFallback: "LEG",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Phased approach validated against regulatory timelines. Industry standard implementation takes 6-12 weeks for similar projects. Your 6-12 week timeline is realistic and allows for proper testing. Legal framework approved.`,
          avatarFallback: "VER",
          side: "right",
        },
      ];

    case ConversationType.PRODUCT_VERIFIER:
      return [
        {
          agent: AgentType.PRODUCT,
          message: `Analyzing "${input}" from a product development standpoint. I'm evaluating user experience, technical feasibility, and feature prioritization. This concept has solid potential with some interesting implementation challenges.`,
          avatarFallback: "PRD",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Product analysis verified against user research data and technical constraints. The UX considerations mentioned align with best practices. Let me validate the technical feasibility claims and feature priorities.`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.PRODUCT,
          message: `Core features should include: intuitive onboarding flow, responsive design for mobile-first experience, real-time data synchronization, and scalable architecture. MVP should focus on the essential user journey first.`,
          avatarFallback: "PRD",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Feature set validated against current tech stack capabilities. Mobile-first approach supported by 80% of users being on mobile devices. Real-time sync is technically feasible with current infrastructure. MVP scope is appropriate.`,
          avatarFallback: "VER",
          side: "right",
        },
        {
          agent: AgentType.PRODUCT,
          message: `Development roadmap: Sprint 1-2 for core architecture, Sprint 3-4 for user interface, Sprint 5-6 for real-time features, Sprint 7-8 for testing and optimization. Each sprint is 2 weeks, total timeline 16 weeks.`,
          avatarFallback: "PRD",
          side: "left",
        },
        {
          agent: AgentType.VERIFIER,
          message: `Roadmap timeline cross-referenced with similar projects. 16-week timeline is realistic for the proposed feature set. Sprint allocation follows agile best practices. Development plan verified and ready for implementation.`,
          avatarFallback: "VER",
          side: "right",
        },
      ];

    default:
      return [];
  }
};
