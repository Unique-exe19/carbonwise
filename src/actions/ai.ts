"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  analyzeHabits,
  getPersonalizedTips,
  generateWeeklyReport,
  getChatResponse,
} from "@/services/ai-service";

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

export async function chatWithAI(message: string) {
  const session = await auth();
  if (!session?.user?.id) return { response: "Please sign in to chat." };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const activities = await prisma.carbonActivity.findMany({
      where: { userId: session.user.id, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "desc" },
    });

    const response = getChatResponse(message, activities);
    return { response };
  } catch (error) {
    console.error("Chat error:", error);
    return { response: "Sorry, I encountered an error. Please try again." };
  }
}
