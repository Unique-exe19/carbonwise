"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@/lib/validations/schemas";

/**
 * Fetch profile settings for the currently authenticated user.
 *
 * @returns {Promise<{
 *   error?: string;
 *   success?: boolean;
 *   name?: string;
 *   email?: string | null;
 *   dietType?: string;
 *   transportMode?: string;
 * }>} Response object containing status and user profile settings
 */
export async function getProfileSettings() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        profile: {
          select: {
            dietType: true,
            transportMode: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return {
      success: true,
      name: user.name || "",
      email: user.email,
      dietType: user.profile?.dietType || "MIXED",
      transportMode: user.profile?.transportMode || "CAR",
    };
  } catch (error) {
    console.error("Get profile settings error:", error);
    return { error: "Failed to fetch profile settings" };
  }
}

/**
 * Update profile settings (name, dietType, transportMode) for the authenticated user.
 * Validates inputs using the Zod updateProfileSchema.
 *
 * @param {Object} data Update parameters
 * @param {string} [data.name] User's full name
 * @param {string} [data.dietType] Dietary preferences (e.g. VEGAN, VEGETARIAN, MIXED)
 * @param {string} [data.transportMode] Default transportation mode (e.g. CAR, BICYCLE)
 * @returns {Promise<{ error?: string; success?: boolean }>} Success status or error message
 */
export async function updateProfileSettings(data: {
  name?: string;
  dietType?: string;
  transportMode?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;

  const validated = updateProfileSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    // 1. Update user name if provided
    if (validated.data.name !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: validated.data.name },
      });
    }

    // 2. Update user profile dietType and transportMode
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(validated.data.dietType && { dietType: validated.data.dietType }),
        ...(validated.data.transportMode && { transportMode: validated.data.transportMode }),
      },
      create: {
        userId,
        dietType: validated.data.dietType || "MIXED",
        transportMode: validated.data.transportMode || "CAR",
      },
    });

    revalidatePath("/settings");
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update profile settings error:", error);
    return { error: "Failed to update profile settings" };
  }
}
