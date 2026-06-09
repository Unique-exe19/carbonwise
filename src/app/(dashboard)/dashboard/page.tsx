import { getDashboardStats, getCarbonTrends, getCategoryBreakdown, getRecentActivities } from "@/actions/dashboard";
import { StatsOverview } from "@/features/dashboard/components/StatsOverview";
import { CarbonTrendChart } from "@/features/dashboard/components/CarbonTrendChart";
import { CategoryBreakdownChart } from "@/features/dashboard/components/CategoryBreakdownChart";
import { RecentActivitiesFeed } from "@/features/dashboard/components/RecentActivitiesFeed";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track your carbon footprint and sustainability progress.",
};

export default async function DashboardPage() {
  const [stats, trends, breakdown, recentActivities] = await Promise.all([
    getDashboardStats(),
    getCarbonTrends(30),
    getCategoryBreakdown(),
    getRecentActivities(5),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-zinc-800 dark:text-zinc-100">
          Welcome back, {stats?.userName || "Explorer"}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Here&apos;s your sustainability overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsOverview stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonTrendChart data={trends} />
        </div>
        <div>
          <CategoryBreakdownChart data={breakdown} />
        </div>
      </div>

      {/* Recent Activities */}
      <RecentActivitiesFeed activities={recentActivities} />
    </div>
  );
}
