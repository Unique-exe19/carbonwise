import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carbon Tracker",
  description: "Log your daily activities and track your carbon footprint/CO2 emissions.",
};

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
