import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StartupSummaryReport } from "@/components/startup-summary-report";
import { SummaryAnalysisService } from "@/services/summaryAnalysis";
import type {
  StartupSuccessReport,
  ConversationResults,
} from "@/types/summaryReport";

export default function SummaryReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<StartupSuccessReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const navigationState = location.state as {
    conversationResults: ConversationResults;
    backendReport?: any;
    usingBackend?: boolean;
  } | null;

  useEffect(() => {
    // Redirect to home if no conversation results provided
    if (!navigationState?.conversationResults) {
      navigate("/");
      return;
    }

    generateReport();
  }, [navigationState, navigate]);

  const generateReport = async () => {
    if (!navigationState?.conversationResults) return;

    try {
      setIsGenerating(true);

      if (navigationState.usingBackend && navigationState.backendReport) {
        // Use backend report directly if available
        const backendReport = navigationState.backendReport;

        // Convert backend report format to frontend format
        const frontendReport: StartupSuccessReport = {
          overallScore: backendReport.overall_score || 75,
          recommendation: backendReport.recommendation || "MODERATE_POTENTIAL",
          metrics: {
            businessModel: {
              label: "Business Model",
              score: backendReport.metrics?.marketing_score || 75,
              description: "Overall business model strength and sustainability",
              details: [
                "Revenue model assessment",
                "Scalability potential",
                "Market fit analysis",
                "Competitive positioning",
              ],
              reasoning:
                "Based on comprehensive AI analysis of market opportunity and business viability.",
              keyFactors: backendReport.key_strengths?.slice(0, 3) || [
                "Strong market validation",
              ],
            },
            legalCompliance: {
              label: "Legal Compliance",
              score: backendReport.metrics?.legal_score || 70,
              description: "Legal and regulatory compliance assessment",
              details: [
                "Regulatory requirements review",
                "Compliance risk assessment",
                "Legal structure evaluation",
                "Intellectual property protection",
              ],
              reasoning:
                "Analysis based on current legal requirements and industry standards.",
              keyFactors: [
                "Standard business regulations",
                "Manageable compliance requirements",
              ],
            },
            productViability: {
              label: "Product Viability",
              score: backendReport.metrics?.product_score || 80,
              description:
                "Technical feasibility and product development assessment",
              details: [
                "Technical feasibility analysis",
                "Development complexity review",
                "Resource requirements",
                "Time-to-market estimation",
              ],
              reasoning:
                "Evaluation of technical implementation and development roadmap.",
              keyFactors: [
                "Clear development path",
                "Achievable technical goals",
              ],
            },
            marketOpportunity: {
              label: "Market Opportunity",
              score: backendReport.metrics?.marketing_score || 75,
              description: "Market size, demand, and growth potential",
              details: [
                "Target market analysis",
                "Demand validation",
                "Growth potential assessment",
                "Market entry strategy",
              ],
              reasoning:
                "Market analysis based on current trends and competitive landscape.",
              keyFactors: backendReport.key_strengths || [
                "Market opportunity identified",
              ],
            },
            teamCapability: {
              label: "Team Capability",
              score: 70,
              description: "Team skills and experience assessment",
              details: [
                "Technical expertise evaluation",
                "Business experience review",
                "Team composition analysis",
                "Advisory support assessment",
              ],
              reasoning:
                "Assessment based on standard startup team requirements.",
              keyFactors: [
                "Team foundation established",
                "Advisory support recommended",
              ],
            },
          },
          summary:
            backendReport.summary ||
            "Comprehensive analysis completed by AI agents.",
          keyStrengths: backendReport.key_strengths || [
            "Strong market opportunity",
          ],
          criticalRisks: backendReport.critical_risks || [
            "Competitive landscape",
          ],
          recommendations: backendReport.recommendations || [
            "Develop detailed business plan",
          ],
          nextSteps: backendReport.next_steps || [
            "Create prototype and test with users",
          ],
        };

        setReport(frontendReport);
      } else {
        // Use simulated analysis service
        const generatedReport = await SummaryAnalysisService.generateReport(
          navigationState.conversationResults
        );
        setReport(generatedReport);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // Could show error state here
    } finally {
      setIsGenerating(false);
    }
  };

  if (!navigationState?.conversationResults) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <StartupSummaryReport report={report!} isGenerating={isGenerating} />
    </div>
  );
}
