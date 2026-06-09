import { getAIInsights } from "@/actions/ai";
import { InsightsContent } from "@/features/insights/components/InsightsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Insights",
  description: "Get AI-powered sustainability tips and weekly reports.",
};

export default async function InsightsPage() {
  const { tips, alerts, report } = await getAIInsights();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading">
          AI Insights ✨
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Personalized sustainability tips powered by your activity data
        </p>
      </div>

      <InsightsContent tips={tips} alerts={alerts} report={report} />
    </div>
  );
}
