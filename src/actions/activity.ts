"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createActivitySchema } from "@/lib/validations/schemas";
import { calculateEmission, getSubCategoryUnit } from "@/services/carbon-calculator";
import { revalidatePath } from "next/cache";

export async function createActivity(data: {
  category: string;
  subCategory: string;
  value: number;
  date?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const parsed = createActivitySchema.safeParse({
    ...data,
    unit: getSubCategoryUnit(data.category, data.subCategory),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const co2Amount = calculateEmission(
    parsed.data.category,
    parsed.data.subCategory,
    parsed.data.value,
  );

  try {
    const activity = await prisma.carbonActivity.create({
      data: {
        userId: session.user.id,
        category: parsed.data.category,
        subCategory: parsed.data.subCategory,
        value: parsed.data.value,
        unit: parsed.data.unit,
        co2Amount,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes || null,
      },
    });

    // Award XP for logging activity
    await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: {
        xp: { increment: 10 },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tracker");

    return { success: true, activity, co2Amount };
  } catch (error) {
    console.error("Create activity error:", error);
    return { error: "Failed to create activity" };
  }
}

export async function getActivities(params?: {
  page?: number;
  limit?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", activities: [], total: 0 };
  }

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId: session.user.id };
  if (params?.category) where.category = params.category;
  if (params?.startDate || params?.endDate) {
    where.date = {
      ...(params?.startDate && { gte: new Date(params.startDate) }),
      ...(params?.endDate && { lte: new Date(params.endDate) }),
    };
  }

  try {
    const [activities, total] = await Promise.all([
      prisma.carbonActivity.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.carbonActivity.count({ where }),
    ]);

    return { activities, total, page, limit };
  } catch (error) {
    console.error("Get activities error:", error);
    return { error: "Failed to fetch activities", activities: [], total: 0 };
  }
}

export async function deleteActivity(activityId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.carbonActivity.delete({
      where: { id: activityId, userId: session.user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tracker");

    return { success: true };
  } catch (error) {
    console.error("Delete activity error:", error);
    return { error: "Failed to delete activity" };
  }
}
