"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { TrendDataPoint } from "@/types";

interface CarbonTrendChartProps {
  data: TrendDataPoint[];
}

export function CarbonTrendChart({ data }: CarbonTrendChartProps) {
  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold font-heading text-zinc-100">
            Carbon Emissions Trend
          </h2>
          <p className="text-sm text-zinc-400">
            Last 30 days
          </p>
        </div>
      </div>

      <div className="h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-800"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-zinc-500"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-zinc-500"
                tickFormatter={(v) => `${v}kg`}
              />
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
                  `${Number(value || 0).toFixed(2)} kg CO₂`,
                  "Emissions",
                ]}
                labelStyle={{ fontWeight: 600, color: "#a1a1aa" }}
              />
              <Area
                type="monotone"
                dataKey="co2"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCO2)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            <div className="text-center flex flex-col items-center">
              <BarChart3 className="w-10 h-10 mb-2 text-zinc-600 animate-pulse" />
              <p className="text-sm">
                No data yet. Start logging activities!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
