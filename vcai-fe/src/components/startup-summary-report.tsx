import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TypographyH1 } from "@/components/ui/typographyH1";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import {
  SUMMARY_REPORT_HEADER_TEXT,
  SUMMARY_REPORT_DESCRIPTION_TEXT,
  RECOMMENDATION_LABELS,
  RECOMMENDATION_COLORS,
  METRIC_ICONS,
  METRIC_LABELS,
} from "@/constants/summaryReport";
import type { StartupSuccessReport } from "@/types/summaryReport";

interface StartupSummaryReportProps {
  report: StartupSuccessReport;
  isGenerating?: boolean;
}

export function StartupSummaryReport({
  report,
  isGenerating = false,
}: StartupSummaryReportProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const createChartData = (score: number) => {
    const getScoreChartColor = (score: number) => {
      if (score >= 80) return "#22c55e"; // green-500
      if (score >= 60) return "#3b82f6"; // blue-500
      if (score >= 40) return "#eab308"; // yellow-500
      return "#ef4444"; // red-500
    };

    return [
      { name: "Score", value: score, fill: getScoreChartColor(score) },
      { name: "Remaining", value: 100 - score, fill: "#374151" }, // gray-700
    ];
  };

  const chartConfig = {
    score: {
      label: "Score",
    },
    remaining: {
      label: "Remaining",
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const toggleCardExpansion = (cardKey: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardKey)) {
        newSet.delete(cardKey);
      } else {
        newSet.add(cardKey);
      }
      return newSet;
    });
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <TypographyH1 text="Generating Analysis..." className="text-white" />
          <p className="text-gray-400">
            Processing agent conversations and generating insights...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <TypographyH1
          text={SUMMARY_REPORT_HEADER_TEXT}
          className="text-white"
        />
        <p className="text-gray-400">{SUMMARY_REPORT_DESCRIPTION_TEXT}</p>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-3">
            <span className="text-4xl">🎯</span>
            <div>
              <div className="text-2xl">Overall Success Score</div>
              <div
                className={`text-5xl font-bold ${getScoreColor(
                  report.overallScore
                )}`}
              >
                {report.overallScore}/100
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={report.overallScore} className="h-3" />
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`${
                RECOMMENDATION_COLORS[report.recommendation]
              } text-white border-none text-lg px-4 py-2`}
            >
              {RECOMMENDATION_LABELS[report.recommendation]}
            </Badge>
          </div>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            {report.summary}
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(report.metrics).map(([key, metric]) => (
          <Card
            key={key}
            className={`bg-gray-900/50 border-gray-700 transition-all duration-300 ${
              expandedCards.has(key) ? "col-span-full lg:col-span-2" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {METRIC_ICONS[key as keyof typeof METRIC_ICONS]}
                  </span>
                  <div>
                    <div className="text-sm">
                      {METRIC_LABELS[key as keyof typeof METRIC_LABELS]}
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        metric.score
                      )}`}
                    >
                      {metric.score}/100
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleCardExpansion(key)}
                  className="p-1 hover:bg-gray-700 rounded-full transition-all duration-200"
                  title={
                    expandedCards.has(key) ? "Hide reasoning" : "Show reasoning"
                  }
                >
                  <InfoCircledIcon
                    className={`w-5 h-5 transition-all duration-200 ${
                      expandedCards.has(key)
                        ? "text-blue-400 rotate-180"
                        : "text-gray-400 hover:text-blue-400"
                    }`}
                  />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`space-y-3 transition-all duration-300 ${
                expandedCards.has(key)
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : ""
              }`}
            >
              <div className="space-y-3">
                {/* Chart Container */}
                <div className="h-32 w-32 mx-auto">
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full"
                  >
                    <PieChart>
                      <Pie
                        data={createChartData(metric.score)}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={50}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {createChartData(metric.score).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent hideLabel />}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>

                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {getScoreLabel(metric.score)}
                  </Badge>
                </div>

                <p className="text-gray-400 text-sm text-center">
                  {metric.description}
                </p>

                <div className="space-y-1">
                  {metric.details.map((detail, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-500 flex items-start gap-1"
                    >
                      <span className="text-blue-400">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded reasoning section - only visible when expanded */}
              {expandedCards.has(key) && (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <InfoCircledIcon className="w-4 h-4 text-blue-400" />
                      AI Analysis Reasoning
                    </h4>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                      {metric.reasoning}
                    </p>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-400">
                        Key Factors Considered:
                      </h5>
                      <div className="space-y-2">
                        {metric.keyFactors.map((factor, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-yellow-400 mt-1">→</span>
                            <span className="flex-1">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">💪</span>
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.keyStrengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-400 text-sm mt-1">✓</span>
                  <span className="text-gray-300 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Risks */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Critical Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.criticalRisks.map((risk, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-red-400 text-sm mt-1">!</span>
                  <span className="text-gray-300 text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations and Next Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 text-sm mt-1">
                    {index + 1}.
                  </span>
                  <span className="text-gray-300 text-sm">
                    {recommendation}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-purple-400 text-sm mt-1">→</span>
                  <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Download Report
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}
