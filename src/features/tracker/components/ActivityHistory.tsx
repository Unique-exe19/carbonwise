"use client";

import { useState, useEffect, useCallback } from "react";
import { getActivities, deleteActivity } from "@/actions/activity";
import { CATEGORIES } from "@/lib/constants/emission-factors";
import { formatCO2, getRelativeTime, cn } from "@/lib/utils";
import { Trash2, Filter, ChevronLeft, ChevronRight, Loader2, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmojiIcon } from "@/components/shared/EmojiIcon";

interface Activity {
  id: string;
  category: string;
  subCategory: string;
  value: number;
  unit: string;
  co2Amount: number;
  date: Date;
  notes: string | null;
  createdAt: Date;
}

export function ActivityHistory() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const limit = 10;

  const loadActivities = useCallback(async () => {
    setLoading(true);
    const result = await getActivities({
      page,
      limit,
      category: filter || undefined,
    });
    if (!result.error) {
      setActivities(result.activities as unknown as Activity[]);
      setTotal(result.total);
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => {
    requestAnimationFrame(() => {
      void loadActivities();
    });
  }, [loadActivities]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteActivity(id);
    router.refresh();
    loadActivities();
    setDeleting(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-heading text-zinc-100">
          Activity History
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "text-sm px-3 py-1.5 rounded-lg",
              "bg-white/[0.03] border border-white/[0.08] text-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500",
              "outline-none focus:ring-2",
            )}
            aria-label="Filter by category"
          >
            <option value="" className="bg-[#111119]">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key} className="bg-[#111119]">
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : activities.length > 0 ? (
        <>
          <div className="space-y-2">
            {activities.map((activity) => {
              const cat =
                CATEGORIES[
                  activity.category as keyof typeof CATEGORIES
                ];
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl",
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
                      {activity.value} {activity.unit}
                      {activity.notes ? ` · ${activity.notes}` : ""}
                      {" · "}
                      {getRelativeTime(new Date(activity.date))}
                    </p>
                  </div>
                  <p className="text-sm font-semibold font-data text-red-400 shrink-0">
                    +{formatCO2(activity.co2Amount)}
                  </p>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    disabled={deleting === activity.id}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all shrink-0 cursor-pointer"
                    aria-label="Delete activity"
                  >
                    {deleting === activity.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.08]">
              <p className="text-sm text-zinc-500">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 text-zinc-400 cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 text-zinc-400 cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-zinc-500">
          <ClipboardList className="w-10 h-10 mb-2 text-zinc-600 mx-auto" />
          <p className="text-sm">
            No activities recorded yet. Select a category above to start.
          </p>
        </div>
      )}
    </div>
  );
}
