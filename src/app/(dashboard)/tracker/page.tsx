"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/constants/emission-factors";
import { cn } from "@/lib/utils";
import { ActivityForm } from "@/features/tracker/components/ActivityForm";
import { ActivityHistory } from "@/features/tracker/components/ActivityHistory";
import { EmojiIcon } from "@/components/shared/EmojiIcon";

type Category = keyof typeof CATEGORIES;

export default function TrackerPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-zinc-100">
          Carbon Tracker
        </h1>
        <p className="text-zinc-400 mt-1">
          Log your daily activities and track CO₂ emissions
        </p>
      </div>

      {/* Category Selector */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {(Object.entries(CATEGORIES) as [Category, (typeof CATEGORIES)[Category]][]).map(
          ([key, cat], i) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() =>
                setSelectedCategory(selectedCategory === key ? null : key)
              }
              className={cn(
                "card-base p-4 flex flex-col items-center gap-2 text-center transition-all cursor-pointer",
                "hover:scale-[1.03] hover:-translate-y-0.5",
                selectedCategory === key
                  ? "ring-2 ring-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                  : "hover:border-white/[0.12] hover:bg-white/[0.01]",
              )}
              aria-pressed={selectedCategory === key}
              aria-label={`Select category: ${cat.label}`}
            >
              <EmojiIcon emoji={cat.icon} className="w-6 h-6 text-emerald-400 mb-1" />
              <span className="text-xs font-medium text-zinc-300">{cat.label}</span>
            </motion.button>
          ),
        )}
      </div>

      {/* Activity Form */}
      <AnimatePresence mode="wait">
        {selectedCategory && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActivityForm
              category={selectedCategory}
              onSuccess={() => setSelectedCategory(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity History */}
      <ActivityHistory />
    </div>
  );
}
