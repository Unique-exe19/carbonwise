import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View your badges, level, XP, achievements, and recent activity logs.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
