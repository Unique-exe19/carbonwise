import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your profile preferences, dietary choices, primary transportation mode, and appearance settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
