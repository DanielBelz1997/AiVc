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
      const generatedReport = await SummaryAnalysisService.generateReport(
        navigationState.conversationResults
      );
      setReport(generatedReport);
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
