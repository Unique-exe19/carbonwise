import type { Metadata } from "next";
import { inter, outfit, jetbrainsMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { SessionProviderWrapper } from "@/components/shared/SessionProviderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarbonWise — Track Your Carbon Footprint",
    template: "%s | CarbonWise",
  },
  description:
    "Track your carbon footprint, get AI-powered sustainability insights, and reduce your environmental impact with CarbonWise — the smart eco-awareness platform.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "eco tracker",
    "climate action",
    "CO2 emissions",
    "green living",
  ],
  authors: [{ name: "CarbonWise Team" }],
  openGraph: {
    title: "CarbonWise — Track Your Carbon Footprint",
    description:
      "Track, understand, and reduce your carbon footprint with AI-powered insights.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
