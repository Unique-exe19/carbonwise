"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createActivitySchema } from "@/lib/validations/schemas";
import { calculateEmission, getSubCategoryUnit } from "@/services/carbon-calculator";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Schema for validating activity deletion requests */
const deleteActivitySchema = z.object({
  activityId: z.string().min(1, "Activity ID is required"),
});

/** Schema for validating activity listing query parameters */
const getActivitiesParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Create a new carbon activity log entry.
 * Validates input via Zod, calculates CO₂ using emission factors,
 * persists to the database, and awards +10 XP to the user.
 */
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

/**
 * Fetch a paginated list of the authenticated user's carbon activities.
 * Supports filtering by category and date range.
 */
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

  const validated = getActivitiesParamsSchema.safeParse(params || {});
  if (!validated.success) {
    return { error: validated.error.issues[0].message, activities: [], total: 0 };
  }

  const page = validated.data.page || 1;
  const limit = validated.data.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId: session.user.id };
  if (validated.data.category) where.category = validated.data.category;
  if (validated.data.startDate || validated.data.endDate) {
    where.date = {
      ...(validated.data.startDate && { gte: new Date(validated.data.startDate) }),
      ...(validated.data.endDate && { lte: new Date(validated.data.endDate) }),
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

/**
 * Delete a carbon activity entry belonging to the authenticated user.
 * Enforces ownership check via userId to prevent IDOR attacks.
 */
export async function deleteActivity(activityId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const validated = deleteActivitySchema.safeParse({ activityId });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.carbonActivity.delete({
      where: { id: validated.data.activityId, userId: session.user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tracker");

    return { success: true };
  } catch (error) {
    console.error("Delete activity error:", error);
    return { error: "Failed to delete activity" };
  }
}
