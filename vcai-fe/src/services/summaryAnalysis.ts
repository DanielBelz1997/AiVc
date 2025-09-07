import type {
  StartupSuccessReport,
  ConversationResults,
  ScoreMetric,
} from "@/types/summaryReport";

/**
 * Simulated AI analysis service that processes conversation results
 * and generates a comprehensive startup success report
 */
export class SummaryAnalysisService {
  static async generateReport(
    conversationResults: ConversationResults
  ): Promise<StartupSuccessReport> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const analysis = this.analyzeConversations(conversationResults);
    return this.generateReportData(analysis, conversationResults);
  }

  private static analyzeConversations(results: ConversationResults) {
    // Simulate conversation analysis
    const marketingScore = this.calculateMarketingScore(
      results.marketingResults
    );
    const legalScore = this.calculateLegalScore(results.legalResults);
    const productScore = this.calculateProductScore(results.productResults);

    return {
      marketingScore,
      legalScore,
      productScore,
      overallComplexity: this.assessComplexity(results.userInput),
      marketPotential: this.assessMarketPotential(results.marketingResults),
      legalRisks: this.assessLegalRisks(results.legalResults),
      productViability: this.assessProductViability(results.productResults),
    };
  }

  private static calculateMarketingScore(marketingResults: string[]): number {
    // Simulate marketing analysis scoring
    const positiveKeywords = [
      "opportunity",
      "growth",
      "demand",
      "market",
      "potential",
    ];
    const negativeKeywords = [
      "risk",
      "competition",
      "saturated",
      "difficult",
      "challenge",
    ];

    const content = marketingResults.join(" ").toLowerCase();
    const positiveScore = positiveKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? 15 : 0),
      0
    );
    const negativeScore = negativeKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? -10 : 0),
      0
    );

    return Math.max(20, Math.min(95, 60 + positiveScore + negativeScore));
  }

  private static calculateLegalScore(legalResults: string[]): number {
    // Simulate legal compliance scoring
    const complianceKeywords = [
      "compliant",
      "approved",
      "legal",
      "regulation",
      "permits",
    ];
    const riskKeywords = [
      "violation",
      "illegal",
      "non-compliant",
      "regulatory",
      "penalty",
    ];

    const content = legalResults.join(" ").toLowerCase();
    const complianceScore = complianceKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? 12 : 0),
      0
    );
    const riskScore = riskKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? -15 : 0),
      0
    );

    return Math.max(25, Math.min(90, 55 + complianceScore + riskScore));
  }

  private static calculateProductScore(productResults: string[]): number {
    // Simulate product viability scoring
    const viabilityKeywords = [
      "feasible",
      "practical",
      "innovative",
      "scalable",
      "viable",
    ];
    const challengeKeywords = [
      "complex",
      "impossible",
      "unrealistic",
      "expensive",
      "difficult",
    ];

    const content = productResults.join(" ").toLowerCase();
    const viabilityScore = viabilityKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? 18 : 0),
      0
    );
    const challengeScore = challengeKeywords.reduce(
      (score, keyword) => score + (content.includes(keyword) ? -12 : 0),
      0
    );

    return Math.max(30, Math.min(88, 65 + viabilityScore + challengeScore));
  }

  private static assessComplexity(
    userInput: string
  ): "low" | "medium" | "high" {
    const complexityIndicators = [
      "AI",
      "blockchain",
      "quantum",
      "biotech",
      "fintech",
    ];
    const input = userInput.toLowerCase();
    const complexityCount = complexityIndicators.filter((indicator) =>
      input.includes(indicator.toLowerCase())
    ).length;

    if (complexityCount >= 2) return "high";
    if (complexityCount === 1) return "medium";
    return "low";
  }

  private static assessMarketPotential(
    marketingResults: string[]
  ): "high" | "medium" | "low" {
    const content = marketingResults.join(" ").toLowerCase();
    if (
      content.includes("billion") ||
      content.includes("huge") ||
      content.includes("massive")
    )
      return "high";
    if (
      content.includes("million") ||
      content.includes("growing") ||
      content.includes("expanding")
    )
      return "medium";
    return "low";
  }

  private static assessLegalRisks(
    legalResults: string[]
  ): "high" | "medium" | "low" {
    const content = legalResults.join(" ").toLowerCase();
    if (
      content.includes("violation") ||
      content.includes("illegal") ||
      content.includes("penalty")
    )
      return "high";
    if (
      content.includes("regulatory") ||
      content.includes("compliance") ||
      content.includes("permit")
    )
      return "medium";
    return "low";
  }

  private static assessProductViability(
    productResults: string[]
  ): "high" | "medium" | "low" {
    const content = productResults.join(" ").toLowerCase();
    if (content.includes("feasible") && content.includes("practical"))
      return "high";
    if (content.includes("complex") || content.includes("challenging"))
      return "low";
    return "medium";
  }

  private static generateReportData(
    analysis: any,
    results: ConversationResults
  ): StartupSuccessReport {
    const businessModelScore = Math.round(
      (analysis.marketingScore + analysis.productScore) / 2
    );
    const overallScore = Math.round(
      (businessModelScore +
        analysis.legalScore +
        analysis.productScore +
        analysis.marketingScore +
        70) /
        5
    );

    const recommendation = this.getRecommendation(overallScore);

    return {
      overallScore,
      recommendation,
      metrics: {
        businessModel: {
          label: "Business Model",
          score: businessModelScore,
          description: "Overall business model strength and sustainability",
          details: [
            "Revenue model assessment",
            "Scalability potential",
            "Market fit analysis",
            "Competitive positioning",
          ],
          reasoning: this.generateBusinessModelReasoning(analysis, results),
          keyFactors: this.getBusinessModelKeyFactors(analysis),
        },
        legalCompliance: {
          label: "Legal Compliance",
          score: analysis.legalScore,
          description: "Legal and regulatory compliance assessment",
          details: [
            "Regulatory requirements review",
            "Compliance risk assessment",
            "Legal structure evaluation",
            "Intellectual property protection",
          ],
          reasoning: this.generateLegalReasoning(analysis, results),
          keyFactors: this.getLegalKeyFactors(analysis),
        },
        productViability: {
          label: "Product Viability",
          score: analysis.productScore,
          description:
            "Technical feasibility and product development assessment",
          details: [
            "Technical feasibility analysis",
            "Development complexity review",
            "Resource requirements",
            "Time-to-market estimation",
          ],
          reasoning: this.generateProductReasoning(analysis, results),
          keyFactors: this.getProductKeyFactors(analysis),
        },
        marketOpportunity: {
          label: "Market Opportunity",
          score: analysis.marketingScore,
          description: "Market size, demand, and growth potential",
          details: [
            "Target market analysis",
            "Demand validation",
            "Growth potential assessment",
            "Market entry strategy",
          ],
          reasoning: this.generateMarketReasoning(analysis, results),
          keyFactors: this.getMarketKeyFactors(analysis),
        },
        teamCapability: {
          label: "Team Capability",
          score: 70, // Simulated score
          description: "Team skills and experience assessment",
          details: [
            "Technical expertise evaluation",
            "Business experience review",
            "Team composition analysis",
            "Advisory support assessment",
          ],
          reasoning: this.generateTeamReasoning(analysis, results),
          keyFactors: this.getTeamKeyFactors(analysis),
        },
      },
      summary: this.generateSummary(overallScore, analysis),
      keyStrengths: this.generateStrengths(analysis),
      criticalRisks: this.generateRisks(analysis),
      recommendations: this.generateRecommendations(analysis),
      nextSteps: this.generateNextSteps(analysis, overallScore),
    };
  }

  private static getRecommendation(
    score: number
  ): StartupSuccessReport["recommendation"] {
    if (score >= 80) return "HIGH_POTENTIAL";
    if (score >= 60) return "MODERATE_POTENTIAL";
    if (score >= 40) return "LOW_POTENTIAL";
    return "HIGH_RISK";
  }

  private static generateSummary(score: number, analysis: any): string {
    if (score >= 80) {
      return "Your startup shows exceptional promise with strong fundamentals across all key areas. The combination of market opportunity, product viability, and legal compliance creates a solid foundation for success.";
    } else if (score >= 60) {
      return "Your startup demonstrates good potential with several strong areas. There are some challenges to address, but the overall foundation is promising with proper execution.";
    } else if (score >= 40) {
      return "Your startup has potential but faces significant challenges that need to be addressed. Focus on strengthening weak areas before proceeding with major investments.";
    } else {
      return "Your startup faces substantial risks and challenges across multiple areas. Consider revisiting the core concept or addressing fundamental issues before moving forward.";
    }
  }

  private static generateStrengths(analysis: any): string[] {
    const strengths = [];
    if (analysis.marketingScore > 70)
      strengths.push("Strong market opportunity with high growth potential");
    if (analysis.productScore > 70)
      strengths.push(
        "Technically feasible product with clear development path"
      );
    if (analysis.legalScore > 70)
      strengths.push("Good legal compliance and regulatory alignment");
    if (analysis.marketPotential === "high")
      strengths.push("Large addressable market with significant demand");
    if (analysis.productViability === "high")
      strengths.push("Highly viable product with proven feasibility");

    return strengths.length > 0
      ? strengths
      : ["Innovative concept with unique market positioning"];
  }

  private static generateRisks(analysis: any): string[] {
    const risks = [];
    if (analysis.marketingScore < 50)
      risks.push("Limited market opportunity or high competition");
    if (analysis.productScore < 50)
      risks.push("Technical challenges or complex development requirements");
    if (analysis.legalScore < 50)
      risks.push("Regulatory compliance issues or legal uncertainties");
    if (analysis.overallComplexity === "high")
      risks.push("High technical complexity may impact development timeline");
    if (analysis.legalRisks === "high")
      risks.push("Significant regulatory hurdles or compliance challenges");

    return risks.length > 0 ? risks : ["Market timing and execution risks"];
  }

  private static generateRecommendations(analysis: any): string[] {
    const recommendations = [];
    if (analysis.marketingScore < 60)
      recommendations.push(
        "Conduct deeper market research and validate demand"
      );
    if (analysis.productScore < 60)
      recommendations.push(
        "Develop a detailed technical roadmap and prototype"
      );
    if (analysis.legalScore < 60)
      recommendations.push(
        "Consult with legal experts for compliance strategy"
      );
    if (analysis.overallComplexity === "high")
      recommendations.push(
        "Consider phased development approach to manage complexity"
      );

    recommendations.push(
      "Build a strong advisory board with industry expertise"
    );
    recommendations.push(
      "Develop a comprehensive business plan with financial projections"
    );

    return recommendations;
  }

  private static generateNextSteps(analysis: any, score: number): string[] {
    const steps = [];

    if (score >= 70) {
      steps.push("Prepare detailed business plan and financial projections");
      steps.push("Begin prototype development and market testing");
      steps.push("Start building founding team and advisory board");
      steps.push("Research funding opportunities and investor networks");
    } else if (score >= 50) {
      steps.push("Address identified risks and strengthen weak areas");
      steps.push("Conduct additional market validation research");
      steps.push("Develop detailed technical specifications");
      steps.push("Create risk mitigation strategies");
    } else {
      steps.push("Revisit core business concept and value proposition");
      steps.push("Conduct comprehensive market and competitive analysis");
      steps.push("Reassess technical feasibility and requirements");
      steps.push("Consider pivoting or refining the business model");
    }

    return steps;
  }

  // Reasoning generation methods
  private static generateBusinessModelReasoning(
    analysis: any,
    results: ConversationResults
  ): string {
    const score = Math.round(
      (analysis.marketingScore + analysis.productScore) / 2
    );

    if (score >= 80) {
      return "The business model shows exceptional strength due to strong market validation and high product viability. Marketing conversations revealed significant demand and growth opportunities, while product discussions confirmed technical feasibility and scalability potential.";
    } else if (score >= 60) {
      return "The business model demonstrates solid fundamentals with good market-product fit. There are positive indicators from both market research and product development perspectives, though some areas may benefit from refinement.";
    } else if (score >= 40) {
      return "The business model has potential but faces notable challenges. Marketing analysis shows mixed signals about market opportunity, and product viability discussions highlight complexity concerns that need addressing.";
    } else {
      return "The business model requires significant strengthening. Both market validation and product development conversations revealed substantial challenges that pose risks to business viability.";
    }
  }

  private static getBusinessModelKeyFactors(analysis: any): string[] {
    const factors = [];
    if (analysis.marketingScore > 60)
      factors.push("Strong market validation signals");
    if (analysis.productScore > 60)
      factors.push("High product development confidence");
    if (analysis.marketPotential === "high")
      factors.push("Large addressable market identified");
    if (analysis.productViability === "high")
      factors.push("Technical implementation deemed feasible");
    if (analysis.overallComplexity === "low")
      factors.push("Low implementation complexity");

    return factors.length > 0
      ? factors
      : ["Mixed signals requiring further analysis"];
  }

  private static generateLegalReasoning(
    analysis: any,
    results: ConversationResults
  ): string {
    const score = analysis.legalScore;

    if (score >= 80) {
      return "Legal assessment indicates strong compliance posture. Conversations with legal experts revealed clear regulatory pathways, minimal compliance barriers, and well-understood legal requirements for the business model.";
    } else if (score >= 60) {
      return "Legal compliance appears manageable with standard business practices. Some regulatory considerations were identified but they fall within normal business operational requirements.";
    } else if (score >= 40) {
      return "Legal analysis reveals moderate compliance challenges that require attention. Several regulatory areas need further investigation and may require specialized legal guidance.";
    } else {
      return "Significant legal and regulatory concerns were identified that could impact business operations. Multiple compliance issues need immediate attention and expert legal consultation.";
    }
  }

  private static getLegalKeyFactors(analysis: any): string[] {
    const factors = [];
    if (analysis.legalScore > 70)
      factors.push("Clear regulatory compliance pathway");
    if (analysis.legalRisks === "low")
      factors.push("Minimal legal risk exposure");
    if (analysis.legalScore > 50)
      factors.push("Standard business regulations apply");
    if (analysis.legalRisks === "high")
      factors.push("Complex regulatory requirements identified");

    return factors.length > 0
      ? factors
      : ["Legal requirements need clarification"];
  }

  private static generateProductReasoning(
    analysis: any,
    results: ConversationResults
  ): string {
    const score = analysis.productScore;

    if (score >= 80) {
      return "Product development assessment shows high confidence in technical execution. Discussions revealed clear development pathways, realistic timelines, and feasible technical requirements that align with current capabilities.";
    } else if (score >= 60) {
      return "Product viability is promising with standard development challenges. Technical discussions indicate the product is achievable within reasonable timeframes and resource constraints.";
    } else if (score >= 40) {
      return "Product development faces notable technical challenges that need careful planning. Complexity concerns and resource requirements suggest a more cautious approach to development timelines.";
    } else {
      return "Significant technical hurdles were identified that may impact product feasibility. Development complexity and resource requirements pose substantial challenges to successful execution.";
    }
  }

  private static getProductKeyFactors(analysis: any): string[] {
    const factors = [];
    if (analysis.productScore > 70)
      factors.push("High technical feasibility confidence");
    if (analysis.productViability === "high")
      factors.push("Clear development roadmap available");
    if (analysis.overallComplexity === "low")
      factors.push("Low technical complexity");
    if (analysis.productScore > 60)
      factors.push("Reasonable development timeline");
    if (analysis.overallComplexity === "high")
      factors.push("High technical complexity concerns");

    return factors.length > 0
      ? factors
      : ["Technical requirements need further analysis"];
  }

  private static generateMarketReasoning(
    analysis: any,
    results: ConversationResults
  ): string {
    const score = analysis.marketingScore;

    if (score >= 80) {
      return "Market analysis reveals exceptional opportunity with strong demand indicators. Marketing conversations highlighted significant growth potential, clear value propositions, and favorable competitive positioning.";
    } else if (score >= 60) {
      return "Market opportunity appears solid with good growth prospects. Marketing analysis shows positive demand signals and viable market entry strategies, though competition exists.";
    } else if (score >= 40) {
      return "Market opportunity has potential but faces competitive challenges. Marketing discussions revealed mixed demand signals and the need for differentiated positioning strategies.";
    } else {
      return "Market analysis indicates significant challenges with limited opportunity. High competition, unclear demand, or market saturation concerns were identified in marketing conversations.";
    }
  }

  private static getMarketKeyFactors(analysis: any): string[] {
    const factors = [];
    if (analysis.marketingScore > 70)
      factors.push("Strong market demand validation");
    if (analysis.marketPotential === "high")
      factors.push("Large market size opportunity");
    if (analysis.marketingScore > 60)
      factors.push("Favorable competitive positioning");
    if (analysis.marketPotential === "medium")
      factors.push("Growing market opportunity");
    if (analysis.marketingScore < 50)
      factors.push("Competitive market challenges");

    return factors.length > 0
      ? factors
      : ["Market dynamics require deeper analysis"];
  }

  private static generateTeamReasoning(
    analysis: any,
    results: ConversationResults
  ): string {
    return "Team capability assessment is based on general startup requirements. While specific team evaluation wasn't conducted in the agent conversations, a moderate score reflects typical early-stage startup team considerations including technical skills, business experience, and advisory support needs.";
  }

  private static getTeamKeyFactors(analysis: any): string[] {
    return [
      "Technical expertise requirements identified",
      "Business development skills needed",
      "Advisory board formation recommended",
      "Team expansion planning required",
    ];
  }
}
