"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Car, Zap, Utensils, ShoppingBag, Droplet, Smartphone, PieChart as PieChartIcon, type LucideIcon } from "lucide-react";
import { CategoryBreakdown } from "@/types";
import { cn } from "@/lib/utils";
import { formatCO2 } from "@/lib/utils";

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  TRAVEL: Car,
  ELECTRICITY: Zap,
  FOOD: Utensils,
  SHOPPING: ShoppingBag,
  WATER: Droplet,
  DEVICE: Smartphone,
};

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const totalCO2 = data.reduce((sum, d) => sum + d.co2, 0);

  return (
    <div className="card-base p-6 h-full">
      <h2 className="text-lg font-semibold font-heading mb-4 text-zinc-100">
        Category Breakdown
      </h2>

      {data.length > 0 ? (
        <>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="co2"
                  animationDuration={1000}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111119",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    fontSize: "13px",
                    color: "#f4f4f5",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [
                    formatCO2(Number(value || 0)),
                    "CO₂",
                  ]}
                />
                {/* Center label */}
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-zinc-100"
                  fontSize="18"
                  fontWeight="bold"
                >
                  {formatCO2(totalCO2)}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-zinc-500"
                  fontSize="11"
                >
                  Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {data.map((item) => {
              const Icon = CATEGORY_ICONS[item.category] || Car;
              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-zinc-500" />
                      {item.label}
                    </span>
                  </div>
                  <span className={cn("font-data font-medium text-zinc-300")}>
                    {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-zinc-500">
          <div className="text-center flex flex-col items-center">
            <PieChartIcon className="w-10 h-10 mb-2 text-zinc-600 animate-pulse" />
            <p className="text-sm">Log activities to see breakdown</p>
          </div>
        </div>
      )}
    </div>
  );
}
