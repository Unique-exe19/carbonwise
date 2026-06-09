"use client";

import { CATEGORIES } from "@/lib/constants/emission-factors";
import { formatCO2, getRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ActivityItem } from "@/types";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { EmojiIcon } from "@/components/shared/EmojiIcon";

interface RecentActivitiesFeedProps {
  activities: ActivityItem[];
}

export function RecentActivitiesFeed({
  activities,
}: RecentActivitiesFeedProps) {
  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-heading text-zinc-100">
          Recent Activities
        </h2>
        <Link
          href="/tracker"
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => {
            const cat =
              CATEGORIES[activity.category as keyof typeof CATEGORIES];
            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl",
                  "hover:bg-white/[0.02]",
                  "transition-colors group",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0",
                    "bg-white/[0.03] border border-white/[0.08] text-emerald-400",
                  )}
                >
                  <EmojiIcon emoji={cat?.icon || "📊"} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-zinc-200">
                    {activity.subCategory
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {activity.value} {activity.unit} ·{" "}
                    {getRelativeTime(new Date(activity.date))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold font-data text-red-400">
                    +{formatCO2(activity.co2Amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-500">
          <Leaf className="w-10 h-10 mb-2 text-zinc-650 mx-auto animate-pulse" />
          <p className="text-sm">No activities yet. Start tracking!</p>
        </div>
      )}
    </div>
  );
}
