"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  analyzeHabits,
  getPersonalizedTips,
  generateWeeklyReport,
  getChatResponse,
} from "@/services/ai-service";
import { z } from "zod";

/** Schema for validating chat message input */
const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message must be under 1000 characters"),
});

/**
 * Fetch AI-powered sustainability insights for the authenticated user.
 * Analyzes the last 30 days of activities to generate personalized tips,
 * habit alerts, and a weekly performance report.
 */
export async function getAIInsights() {
  const session = await auth();
  if (!session?.user?.id) return { tips: [], alerts: [], report: null };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  try {
    const [allActivities, currentWeek, previousWeek] = await Promise.all([
      prisma.carbonActivity.findMany({
        where: { userId: session.user.id, date: { gte: thirtyDaysAgo } },
        orderBy: { date: "desc" },
      }),
      prisma.carbonActivity.findMany({
        where: { userId: session.user.id, date: { gte: sevenDaysAgo } },
      }),
      prisma.carbonActivity.findMany({
        where: {
          userId: session.user.id,
          date: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
    ]);

    const tips = getPersonalizedTips(allActivities, 6);
    const alerts = analyzeHabits(allActivities);
    const report = generateWeeklyReport(currentWeek, previousWeek);

    return { tips, alerts, report };
  } catch (error) {
    console.error("AI insights error:", error);
    return { tips: [], alerts: [], report: null };
  }
}

/**
 * Send a chat message to the rule-based AI sustainability assistant.
 * The assistant uses the user's recent activity data to provide
 * personalized, context-aware responses without external API calls.
 */
export async function chatWithAI(message: string) {
  const session = await auth();
  if (!session?.user?.id) return { response: "Please sign in to chat." };

  // Validate and sanitize the input message
  const validated = chatMessageSchema.safeParse({ message });
  if (!validated.success) {
    return { response: validated.error.issues[0].message };
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const activities = await prisma.carbonActivity.findMany({
      where: { userId: session.user.id, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "desc" },
    });

    const response = getChatResponse(validated.data.message, activities);
    return { response };
  } catch (error) {
    console.error("Chat error:", error);
    return { response: "Sorry, I encountered an error. Please try again." };
  }
}
