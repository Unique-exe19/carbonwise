import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "@/features/profile/components/ProfileContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your sustainability profile and achievements.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user, profile, activitiesCount, badgesCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, createdAt: true },
    }),
    prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.carbonActivity.count({ where: { userId: session.user.id } }),
    prisma.userBadge.count({ where: { userId: session.user.id } }),
  ]);

  const totalCO2 = await prisma.carbonActivity.aggregate({
    where: { userId: session.user.id },
    _sum: { co2Amount: true },
  });

  return (
    <ProfileContent
      user={user}
      profile={profile}
      activitiesCount={activitiesCount}
      badgesCount={badgesCount}
      totalCO2={totalCO2._sum.co2Amount || 0}
    />
  );
}
