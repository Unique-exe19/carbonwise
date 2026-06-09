"use client";

import Link from "next/link";
import { Calculator, Sparkles, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const actions = [
  {
    href: "/tracker",
    icon: Calculator,
    label: "Log Activity",
    description: "Track your emissions",
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/10",
  },
  {
    href: "/insights",
    icon: Sparkles,
    label: "AI Insights",
    description: "Get eco tips",
    gradient: "from-violet-500 to-purple-500",
    bgGlow: "bg-violet-500/10",
  },
  {
    href: "/challenges",
    icon: Trophy,
    label: "Challenges",
    description: "Join eco challenges",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    href: "/community",
    icon: Users,
    label: "Community",
    description: "Share progress",
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/10",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 + 0.3, duration: 0.3 }}
          >
            <Link
              href={action.href}
              className={cn(
                "card-base p-4 flex flex-col items-center text-center gap-2",
                "hover:scale-[1.03] hover:-translate-y-1",
                "group",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-2xl",
                  "bg-gradient-to-br text-white",
                  action.gradient,
                  "shadow-lg group-hover:shadow-xl transition-shadow",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden md:block">
                {action.description}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
