export interface ScoreMetric {
  label: string;
  score: number; // 0-100
  description: string;
  details: string[];
  reasoning: string;
  keyFactors: string[];
}

export interface StartupSuccessReport {
  overallScore: number; // 0-100
  recommendation:
    | "HIGH_POTENTIAL"
    | "MODERATE_POTENTIAL"
    | "LOW_POTENTIAL"
    | "HIGH_RISK";
  metrics: {
    businessModel: ScoreMetric;
    legalCompliance: ScoreMetric;
    productViability: ScoreMetric;
    marketOpportunity: ScoreMetric;
    teamCapability: ScoreMetric;
  };
  summary: string;
  keyStrengths: string[];
  criticalRisks: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface ConversationResults {
  marketingResults: string[];
  legalResults: string[];
  productResults: string[];
  userInput: string;
}
