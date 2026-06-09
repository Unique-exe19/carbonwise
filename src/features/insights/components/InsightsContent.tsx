"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { chatWithAI } from "@/actions/ai";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Send,
  Loader2,
  MessageCircle,
  Lightbulb,
  Target,
  Bot,
  User,
  Trophy,
} from "lucide-react";
import type { AIInsight, WeeklyReport } from "@/types";
import { EmojiIcon } from "@/components/shared/EmojiIcon";

interface InsightsContentProps {
  tips: AIInsight[];
  alerts: AIInsight[];
  report: WeeklyReport | null;
}

export function InsightsContent({ tips, alerts, report }: InsightsContentProps) {
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Sustainability Assistant. Ask me anything about reducing your carbon footprint, understanding emissions, or getting personalized eco tips!",
    },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;

    const userMsg = input.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setChatLoading(true);

    const { response } = await chatWithAI(userMsg);
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: response },
    ]);
    setChatLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Tips + Alerts */}
      <div className="lg:col-span-2 space-y-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold font-heading flex items-center gap-2 text-zinc-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Habit Alerts
            </h2>
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-base p-4 border-l-4 border-amber-500"
              >
                <div className="flex items-start gap-3">
                  <EmojiIcon emoji={alert.icon} className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-200">{alert.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {alert.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Weekly Report */}
        {report && (
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
              <Target className="w-5 h-5 text-emerald-500" />
              Weekly Report — {report.period}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-bold font-data text-zinc-100">
                  {report.totalCO2.toFixed(1)}
                </p>
                <p className="text-xs text-zinc-500">kg CO₂ this week</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-center gap-1">
                  {report.changePercent <= 0 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-405" />
                  )}
                  <p
                    className={cn(
                      "text-2xl font-bold font-data",
                      report.changePercent <= 0
                        ? "text-emerald-400"
                        : "text-red-400",
                    )}
                  >
                    {report.changePercent}%
                  </p>
                </div>
                <p className="text-xs text-zinc-500">vs last week</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-bold font-data text-zinc-100">
                  {report.score}
                </p>
                <p className="text-xs text-zinc-500">Eco Score</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-lg font-bold text-zinc-150">
                  {report.topCategory !== "N/A"
                    ? `${report.topCategory.charAt(0)}${report.topCategory.slice(1).toLowerCase()}`
                    : "—"}
                </p>
                <p className="text-xs text-zinc-500">Top category</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-zinc-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Achievements
              </h3>
              <div className="space-y-1">
                {report.achievements.map((a, i) => (
                  <p key={i} className="text-sm text-zinc-400">
                    {a}
                  </p>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-zinc-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-yellow-400" /> Recommendations
              </h3>
              <div className="space-y-1">
                {report.recommendations.map((r, i) => (
                  <p key={i} className="text-sm text-zinc-400">
                    {r}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips Grid */}
        <div>
          <h2 className="text-lg font-semibold font-heading flex items-center gap-2 mb-4 text-zinc-100">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Personalized Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.length > 0 ? (
              tips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card-base p-4 hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-3">
                    <EmojiIcon emoji={tip.icon} className="w-5 h-5 text-emerald-450 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-zinc-200">{tip.title}</h3>
                        {tip.impact && (
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium border",
                              tip.impact === "Very High"
                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                : tip.impact === "High"
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                  : "bg-blue-500/10 border-blue-500/20 text-blue-400",
                            )}
                          >
                            {tip.impact}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-zinc-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Log some activities to get personalized tips!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Chat */}
      <div className="card-base flex flex-col h-[600px]">
        <div className="p-4 border-b border-white/[0.08]">
          <h2 className="font-semibold font-heading flex items-center gap-2 text-zinc-100">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            Eco Assistant
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ask anything about sustainability
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-md"
                    : "bg-white/[0.05] border border-white/[0.08] text-zinc-100 rounded-bl-md",
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-zinc-350" />
                </div>
              )}
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about sustainability..."
              className={cn(
                "flex-1 px-3 py-2 rounded-xl text-sm",
                "bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-650",
                "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                "outline-none transition-all",
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer",
                "bg-emerald-500 text-white hover:bg-emerald-600",
                "disabled:opacity-50 transition-all",
              )}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
