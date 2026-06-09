"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants/emission-factors";
import { Trophy, Users, Zap, Clock, CheckCircle2 } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  targetUnit: string;
  xpReward: number;
  startDate: string;
  endDate: string;
  isDaily: boolean;
  progress: number;
  status: string;
  participantCount: number;
}

interface ChallengesContentProps {
  challenges: Challenge[];
}

export function ChallengesContent({ challenges }: ChallengesContentProps) {
  const [filter, setFilter] = useState("ALL");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [nowTimestamp, setNowTimestamp] = useState<number | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setNowTimestamp(Date.now());
    });
  }, []);

  const filteredChallenges =
    filter === "ALL"
      ? challenges
      : challenges.filter((c) => c.category === filter);

  const handleJoin = (id: string) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Challenges", value: challenges.length, icon: Trophy, color: "text-amber-500" },
          { label: "Total Participants", value: challenges.reduce((s, c) => s + c.participantCount, 0).toLocaleString(), icon: Users, color: "text-blue-500" },
          { label: "XP Available", value: challenges.reduce((s, c) => s + c.xpReward, 0), icon: Zap, color: "text-yellow-500" },
          { label: "Joined", value: joined.size, icon: CheckCircle2, color: "text-emerald-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-base p-4 text-center"
          >
            <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
            <p className="text-xl font-bold font-data">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setFilter("ALL")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
            filter === "ALL"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700",
          )}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              filter === key
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700",
            )}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge, i) => {
          const cat = CATEGORIES[challenge.category as keyof typeof CATEGORIES];
          const isJoined = joined.has(challenge.id);
          const daysLeft = nowTimestamp
            ? Math.ceil((new Date(challenge.endDate).getTime() - nowTimestamp) / 86400000)
            : 0;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "card-base p-5 hover:scale-[1.01]",
                isJoined && "ring-2 ring-primary-500 border-primary-200 dark:border-primary-800",
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat?.icon}</span>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      `bg-category-${challenge.category.toLowerCase()}`,
                      `category-${challenge.category.toLowerCase()}`,
                    )}
                  >
                    {cat?.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{challenge.xpReward} XP</span>
                </div>
              </div>

              <h3 className="font-semibold mb-1">{challenge.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {challenge.description}
              </p>

              {/* Progress bar (only for joined) */}
              {isJoined && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>0/{challenge.targetValue} {challenge.targetUnit}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full transition-all"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participantCount + (isJoined ? 1 : 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {daysLeft}d left
                  </span>
                </div>
                <button
                  onClick={() => handleJoin(challenge.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    isJoined
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "bg-gradient-to-r from-primary-500 to-teal-600 text-white hover:brightness-110 shadow-md shadow-primary-500/20",
                  )}
                >
                  {isJoined ? "✓ Joined" : "Join Challenge"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
