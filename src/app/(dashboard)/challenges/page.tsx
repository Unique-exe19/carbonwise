import type { Metadata } from "next";
import { ChallengesContent } from "@/features/gamification/components/ChallengesContent";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Join eco challenges and earn XP rewards.",
};

// Curated challenges that don't depend on database seeding
const STATIC_CHALLENGES = [
  {
    id: "ch1", title: "Meatless Monday", description: "Go without meat for an entire Monday. Log only vegetarian or vegan food items.",
    category: "FOOD", targetValue: 1, targetUnit: "day", xpReward: 50,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 234,
  },
  {
    id: "ch2", title: "Bike to Work Week", description: "Use a bicycle instead of a car for your daily commute for 5 consecutive days.",
    category: "TRAVEL", targetValue: 5, targetUnit: "days", xpReward: 100,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 156,
  },
  {
    id: "ch3", title: "5-Minute Shower Challenge", description: "Keep all your showers under 5 minutes for a week.",
    category: "WATER", targetValue: 7, targetUnit: "days", xpReward: 75,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 189,
  },
  {
    id: "ch4", title: "Unplug Challenge", description: "Unplug all unnecessary electronics and phantom loads for 3 days.",
    category: "ELECTRICITY", targetValue: 3, targetUnit: "days", xpReward: 60,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 312,
  },
  {
    id: "ch5", title: "Zero Waste Lunch", description: "Bring a zero-waste packed lunch with no single-use plastics for 5 days.",
    category: "SHOPPING", targetValue: 5, targetUnit: "days", xpReward: 80,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 98,
  },
  {
    id: "ch6", title: "Digital Detox", description: "Limit screen time to 2 hours per day for 3 days to reduce device energy consumption.",
    category: "DEVICE", targetValue: 3, targetUnit: "days", xpReward: 45,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 67,
  },
  {
    id: "ch7", title: "Public Transit Hero", description: "Use public transportation instead of personal vehicle for all trips this week.",
    category: "TRAVEL", targetValue: 7, targetUnit: "days", xpReward: 120,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 145,
  },
  {
    id: "ch8", title: "Local Food Week", description: "Buy only locally sourced food items for an entire week.",
    category: "FOOD", targetValue: 7, targetUnit: "days", xpReward: 90,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isDaily: false, progress: 0, status: "AVAILABLE", participantCount: 78,
  },
];

export default function ChallengesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading">
          Eco Challenges 🏆
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Join challenges, earn XP, and build sustainable habits
        </p>
      </div>

      <ChallengesContent challenges={STATIC_CHALLENGES} />
    </div>
  );
}
