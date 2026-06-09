"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  try {
    // 1. Update user name
    if (data.name !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name },
      });
    }

    // 2. Update user profile dietType and transportMode
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(data.dietType && { dietType: data.dietType }),
        ...(data.transportMode && { transportMode: data.transportMode }),
      },
      create: {
        userId,
        dietType: data.dietType || "MIXED",
        transportMode: data.transportMode || "CAR",
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
