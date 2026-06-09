import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Community",
  description: "Share your eco-friendly progress, discuss sustainability, and compete on the leaderboard.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
