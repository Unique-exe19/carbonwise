"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  TrendingDown,
  Zap,
  Flame,
  Trophy,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCO2, formatNumber } from "@/lib/utils";
import { LEVEL_TITLES } from "@/lib/constants/emission-factors";

interface StatsOverviewProps {
  stats: {
    totalCO2: number;
    todayCO2: number;
    weekCO2: number;
    monthCO2: number;
    reductionPercent: number;
    activitiesCount: number;
    currentStreak: number;
    xp: number;
    level: number;
  } | null;
}

const statCards = [
  {
    key: "todayCO2",
    label: "Today's Emissions",
    icon: Activity,
    format: (v: number) => formatCO2(v),
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/30",
  },
  {
    key: "weekCO2",
    label: "This Week",
    icon: Leaf,
    format: (v: number) => formatCO2(v),
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
  },
  {
    key: "reductionPercent",
    label: "Monthly Reduction",
    icon: TrendingDown,
    format: (v: number) => `${v > 0 ? "+" : ""}${v}%`,
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/30",
  },
  {
    key: "currentStreak",
    label: "Streak",
    icon: Flame,
    format: (v: number) => `${v} days`,
    gradient: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
  },
  {
    key: "xp",
    label: "Experience",
    icon: Zap,
    format: (v: number) => `${formatNumber(v, 0)} XP`,
    gradient: "from-amber-500 to-yellow-500",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/30",
  },
  {
    key: "level",
    label: "Level",
    icon: Trophy,
    format: (v: number) =>
      `Lv.${v} ${LEVEL_TITLES[Math.min(v - 1, LEVEL_TITLES.length - 1)]}`,
    gradient: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-950/30",
  },
] as const;

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {statCards.map((card, i) => {
        const value = stats
          ? (stats[card.key as keyof typeof stats] as number)
          : 0;
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={cn(
              "card-base p-4 group cursor-default",
              "hover:scale-[1.02] hover:-translate-y-0.5",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl mb-3",
                card.bgLight,
                card.bgDark,
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 bg-gradient-to-r bg-clip-text",
                  card.gradient,
                )}
                style={{
                  color: `var(--tw-gradient-from)`,
                }}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              {card.label}
            </p>
            <p className="text-lg font-bold font-data truncate text-zinc-800 dark:text-zinc-100">
              {card.format(value)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
