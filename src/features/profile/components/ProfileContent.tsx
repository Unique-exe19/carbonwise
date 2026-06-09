"use client";

import { motion } from "framer-motion";
import { cn, formatCO2, getInitials } from "@/lib/utils";
import Image from "next/image";
import { LEVEL_TITLES, LEVEL_THRESHOLDS } from "@/lib/constants/emission-factors";
import {
  MapPin, Calendar, Flame, Zap, Activity,
  Leaf, Award, Sprout, Search, Target, Scissors,
  Megaphone, Sparkles,
} from "lucide-react";

interface ProfileContentProps {
  user: { name: string | null; email: string | null; image: string | null; createdAt: Date } | null;
  profile: {
    xp: number; level: number; currentStreak: number; longestStreak: number;
    totalCO2Saved: number; dietType: string; transportMode: string;
    location: string | null; bio: string | null;
  } | null;
  activitiesCount: number;
  badgesCount: number;
  totalCO2: number;
}

const BADGE_SHOWCASE = [
  { name: "First Step", icon: Sprout, desc: "Logged first activity", color: "from-emerald-500 to-green-600" },
  { name: "Eco Curious", icon: Search, desc: "Explored all categories", color: "from-cyan-500 to-blue-600" },
  { name: "Streak Starter", icon: Flame, desc: "3-day streak", color: "from-orange-500 to-red-600" },
  { name: "Carbon Cutter", icon: Scissors, desc: "Reduced 10% in a week", color: "from-violet-500 to-purple-600" },
  { name: "Community Voice", icon: Megaphone, desc: "First community post", color: "from-pink-500 to-rose-600" },
  { name: "Challenge Accepted", icon: Target, desc: "Joined first challenge", color: "from-amber-500 to-yellow-600" },
];

export function ProfileContent({
  user,
  profile,
  activitiesCount,
  badgesCount,
  totalCO2,
}: ProfileContentProps) {
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
  const prevLevelXP = LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)];
  const progress = nextLevelXP > prevLevelXP ? ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 100;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base overflow-visible"
      >
        {/* Banner */}
        <div className="h-36 rounded-t-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Profile Info - positioned below the banner */}
        <div className="px-6 pt-0 pb-6 relative">
          {/* Avatar - overlapping the banner bottom */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-[#111119] shadow-2xl shrink-0 overflow-hidden">
              {user?.image ? (
                <Image src={user.image} alt="Profile Picture" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-2xl font-bold font-heading text-zinc-100">
                {user?.name || "Explorer"}
              </h1>
              <p className="text-sm text-zinc-500">{user?.email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined{" "}
                  {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                <Zap className="w-4 h-4" /> Level {level} — {levelTitle}
              </span>
              <span className="text-xs text-amber-500/70 font-data">
                {xp} / {nextLevelXP} XP
              </span>
            </div>
            <div className="h-2.5 bg-amber-500/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total CO₂ Tracked", value: formatCO2(totalCO2), icon: Leaf, color: "text-emerald-400" },
          { label: "Activities Logged", value: activitiesCount.toString(), icon: Activity, color: "text-blue-400" },
          { label: "Current Streak", value: `${profile?.currentStreak || 0} days`, icon: Flame, color: "text-orange-400" },
          { label: "Badges Earned", value: badgesCount.toString(), icon: Award, color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="card-base p-4 text-center hover-glow"
          >
            <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
            <p className="text-lg font-bold font-data text-zinc-100">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badge Showcase */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold font-heading flex items-center gap-2 mb-5 text-zinc-100">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Badge Collection
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {BADGE_SHOWCASE.map((badge, i) => {
            const Icon = badge.icon;
            const earned = i < badgesCount;
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-all",
                  earned
                    ? "bg-white/[0.03] border border-white/[0.06] hover-glow"
                    : "bg-white/[0.01] border border-white/[0.03] opacity-30",
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  earned
                    ? `bg-gradient-to-br ${badge.color} text-white shadow-lg`
                    : "bg-zinc-800 text-zinc-600",
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-tight text-zinc-400">
                  {badge.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
