"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants/emission-factors";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  try {
    const [
      profile,
      totalCO2Result,
      todayCO2Result,
      weekCO2Result,
      monthCO2Result,
      prevMonthCO2Result,
      activitiesCount,
    ] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.carbonActivity.aggregate({
        where: { userId },
        _sum: { co2Amount: true },
      }),
      prisma.carbonActivity.aggregate({
        where: { userId, date: { gte: todayStart } },
        _sum: { co2Amount: true },
      }),
      prisma.carbonActivity.aggregate({
        where: { userId, date: { gte: weekStart } },
        _sum: { co2Amount: true },
      }),
      prisma.carbonActivity.aggregate({
        where: { userId, date: { gte: monthStart } },
        _sum: { co2Amount: true },
      }),
      prisma.carbonActivity.aggregate({
        where: {
          userId,
          date: { gte: prevMonthStart, lt: monthStart },
        },
        _sum: { co2Amount: true },
      }),
      prisma.carbonActivity.count({ where: { userId } }),
    ]);

    const totalCO2 = totalCO2Result._sum.co2Amount || 0;
    const todayCO2 = todayCO2Result._sum.co2Amount || 0;
    const weekCO2 = weekCO2Result._sum.co2Amount || 0;
    const monthCO2 = monthCO2Result._sum.co2Amount || 0;
    const prevMonthCO2 = prevMonthCO2Result._sum.co2Amount || 0;

    const reductionPercent =
      prevMonthCO2 > 0
        ? Math.round(((prevMonthCO2 - monthCO2) / prevMonthCO2) * 100)
        : 0;

    return {
      totalCO2,
      todayCO2,
      weekCO2,
      monthCO2,
      reductionPercent,
      activitiesCount,
      currentStreak: profile?.currentStreak || 0,
      xp: profile?.xp || 0,
      level: profile?.level || 1,
      userName: session.user.name || "User",
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return null;
  }
}

export async function getCarbonTrends(days: number = 30) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const activities = await prisma.carbonActivity.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate },
      },
      select: { date: true, co2Amount: true },
      orderBy: { date: "asc" },
    });

    // Group by date
    const grouped: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      grouped[key] = 0;
    }

    for (const a of activities) {
      const key = a.date.toISOString().split("T")[0];
      if (grouped[key] !== undefined) {
        grouped[key] += a.co2Amount;
      }
    }

    return Object.entries(grouped).map(([date, co2]) => ({
      date,
      co2: Math.round(co2 * 100) / 100,
      label: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Carbon trends error:", error);
    return [];
  }
}

export async function getCategoryBreakdown() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const activities = await prisma.carbonActivity.groupBy({
      by: ["category"],
      where: { userId: session.user.id },
      _sum: { co2Amount: true },
    });

    const totalCO2 = activities.reduce(
      (sum: number, a: { _sum: { co2Amount: number | null } }) => sum + (a._sum.co2Amount || 0),
      0,
    );

    return activities.map((a: { category: string; _sum: { co2Amount: number | null } }) => {
      const cat = CATEGORIES[a.category as keyof typeof CATEGORIES];
      const co2 = a._sum.co2Amount || 0;
      return {
        category: a.category,
        label: cat?.label || a.category,
        co2: Math.round(co2 * 100) / 100,
        percentage: totalCO2 > 0 ? Math.round((co2 / totalCO2) * 100) : 0,
        color: cat?.color || "#6B7280",
        icon: cat?.icon || "📊",
      };
    });
  } catch (error) {
    console.error("Category breakdown error:", error);
    return [];
  }
}

export async function getRecentActivities(limit: number = 5) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const activities = await prisma.carbonActivity.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
    });

    return activities.map((a: { id: string; category: string; subCategory: string; value: number; unit: string; co2Amount: number; date: Date; notes: string | null }) => ({
      id: a.id,
      category: a.category,
      subCategory: a.subCategory,
      value: a.value,
      unit: a.unit,
      co2Amount: a.co2Amount,
      date: a.date.toISOString(),
      notes: a.notes,
    }));
  } catch (error) {
    console.error("Recent activities error:", error);
    return [];
  }
}
