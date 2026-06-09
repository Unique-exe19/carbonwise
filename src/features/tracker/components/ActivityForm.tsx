"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { createActivity } from "@/actions/activity";
import { getSubCategories } from "@/services/carbon-calculator";
import { calculateEmission, getEnvironmentalEquivalents } from "@/services/carbon-calculator";
import { cn, formatCO2 } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants/emission-factors";
import { Loader2, Check, TreePine, Car, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmojiIcon } from "@/components/shared/EmojiIcon";

interface ActivityFormProps {
  category: string;
  onSuccess: () => void;
}

export function ActivityForm({ category, onSuccess }: ActivityFormProps) {
  const router = useRouter();
  const [subCategory, setSubCategory] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subCategories = useMemo(() => getSubCategories(category), [category]);
  const cat = CATEGORIES[category as keyof typeof CATEGORIES];

  // Real-time CO₂ preview
  const co2Preview = useMemo(() => {
    if (!subCategory || !value || parseFloat(value) <= 0) return 0;
    return calculateEmission(category, subCategory, parseFloat(value));
  }, [category, subCategory, value]);

  const equivalents = useMemo(
    () => getEnvironmentalEquivalents(co2Preview),
    [co2Preview],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategory || !value) return;

    setLoading(true);
    const result = await createActivity({
      category,
      subCategory,
      value: parseFloat(value),
      notes: notes || undefined,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        router.refresh();
      }, 1500);
    }
  };

  return (
    <div className="card-base p-6">
      <div className="flex items-center gap-3 mb-6">
        <EmojiIcon emoji={cat?.icon || "📊"} className="w-6 h-6 text-emerald-400" />
        <h2 className="text-lg font-semibold font-heading text-zinc-100">
          Log {cat?.label} Activity
        </h2>
      </div>

      {success ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-450" />
          </div>
          <p className="text-lg font-semibold text-emerald-400">
            Activity Logged! +10 XP
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            {formatCO2(co2Preview)} added to your footprint
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sub-category selector */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">
              What type?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {subCategories.map((sub) => (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => setSubCategory(sub.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left group",
                    "border transition-all duration-200 cursor-pointer",
                    subCategory === sub.value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
                  )}
                >
                  <EmojiIcon emoji={sub.icon} className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  <span className="truncate">{sub.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value input */}
          {subCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label
                htmlFor="activity-value"
                className="block text-sm font-medium mb-2 text-zinc-300"
              >
                How much?
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    id="activity-value"
                    type="number"
                    step="0.1"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter amount"
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl text-sm",
                      "bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-650",
                      "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                      "transition-all duration-200 outline-none",
                    )}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                    {
                      subCategories.find((s) => s.value === subCategory)
                        ?.unit
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {subCategory && (
            <div>
              <label
                htmlFor="activity-notes"
                className="block text-sm font-medium mb-2 text-zinc-300"
              >
                Notes (optional)
              </label>
              <input
                id="activity-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Commute to office"
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl text-sm",
                  "bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-650",
                  "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                  "transition-all duration-200 outline-none",
                )}
              />
            </div>
          )}

          {/* CO₂ Preview */}
          {co2Preview > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10"
            >
              <p className="text-sm font-medium text-red-400 mb-2">
                Estimated CO₂ Impact
              </p>
              <p className="text-3xl font-bold font-data text-red-400">
                {formatCO2(co2Preview)}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  {equivalents.treesNeeded} trees needed/year
                </span>
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-blue-400" />
                  {equivalents.carKm} km driving
                </span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  {equivalents.smartphoneCharges} phone charges
                </span>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !subCategory || !value}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold",
              "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
              "hover:brightness-110 shadow-lg shadow-emerald-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 cursor-pointer",
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Log Activity"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
