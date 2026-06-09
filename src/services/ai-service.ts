/**
 * Rule-based AI Sustainability Engine
 * Generates personalized eco tips, habit alerts, and weekly reports
 * without requiring any external API keys.
 */

import { CATEGORIES } from "@/lib/constants/emission-factors";
import type { AIInsight, WeeklyReport } from "@/types";

// ─── Knowledge Base ────────────────────────────────────────────────────────

const ECO_TIPS: Record<string, AIInsight[]> = {
  TRAVEL: [
    {
      id: "t1", type: "tip", title: "Switch to Public Transit",
      content: "Taking public transit instead of driving can reduce your travel emissions by up to 65%. A bus ride produces about 0.089 kg CO₂/km compared to 0.21 kg/km for a petrol car.",
      category: "TRAVEL", impact: "High", icon: "🚌",
    },
    {
      id: "t2", type: "tip", title: "Try Carpooling",
      content: "Sharing rides with 3 other people effectively cuts your per-person emissions by 75%. Apps like BlaBlaCar and Waze Carpool make it easy.",
      category: "TRAVEL", impact: "High", icon: "🚗",
    },
    {
      id: "t3", type: "tip", title: "Consider an E-Bike",
      content: "E-bikes produce only 0.022 kg CO₂/km — nearly 10x less than a car. For commutes under 15 km, they're faster than cars in many cities.",
      category: "TRAVEL", impact: "High", icon: "🚲",
    },
    {
      id: "t4", type: "recommendation", title: "Fly Less, Train More",
      content: "A single short-haul flight emits 0.255 kg CO₂/km — 6x more than a train. For distances under 600 km, trains are often competitive in total travel time.",
      category: "TRAVEL", impact: "Very High", icon: "🚆",
    },
    {
      id: "t5", type: "tip", title: "Optimize Driving Habits",
      content: "Eco-driving techniques like gentle acceleration, maintaining steady speed, and proper tire inflation can reduce fuel consumption by 15-20%.",
      category: "TRAVEL", impact: "Medium", icon: "⛽",
    },
  ],
  ELECTRICITY: [
    {
      id: "e1", type: "tip", title: "Switch to LED Lighting",
      content: "LED bulbs use 75% less energy than incandescent bulbs and last 25x longer. Switching all lights in your home could save 200+ kg CO₂/year.",
      category: "ELECTRICITY", impact: "Medium", icon: "💡",
    },
    {
      id: "e2", type: "tip", title: "Unplug Phantom Loads",
      content: "Devices on standby ('phantom loads') can account for 5-10% of household energy use. Use smart power strips to eliminate them.",
      category: "ELECTRICITY", impact: "Medium", icon: "🔌",
    },
    {
      id: "e3", type: "recommendation", title: "Consider Green Energy",
      content: "Switching to a renewable energy provider can reduce your electricity emissions by 80-95%. Many providers now offer competitive rates.",
      category: "ELECTRICITY", impact: "Very High", icon: "☀️",
    },
    {
      id: "e4", type: "tip", title: "Optimize Thermostat",
      content: "Lowering your thermostat by 1°C can reduce heating energy by 8-10%. Smart thermostats can automate this and save 150+ kg CO₂/year.",
      category: "ELECTRICITY", impact: "High", icon: "🌡️",
    },
  ],
  FOOD: [
    {
      id: "f1", type: "tip", title: "Reduce Red Meat Consumption",
      content: "Beef produces 27 kg CO₂ per kg — 7x more than chicken and 13x more than vegetables. Even one meat-free day per week makes a significant impact.",
      category: "FOOD", impact: "Very High", icon: "🥦",
    },
    {
      id: "f2", type: "tip", title: "Buy Local and Seasonal",
      content: "Local seasonal produce travels less and requires less cold storage. This can reduce food transport emissions by 5-10x compared to imported goods.",
      category: "FOOD", impact: "Medium", icon: "🌾",
    },
    {
      id: "f3", type: "recommendation", title: "Reduce Food Waste",
      content: "The average household wastes 30% of purchased food. Planning meals, using leftovers creatively, and composting can save both emissions and money.",
      category: "FOOD", impact: "High", icon: "♻️",
    },
    {
      id: "f4", type: "tip", title: "Choose Plant-Based Milk",
      content: "Oat milk produces 0.9 kg CO₂/liter vs 3.2 kg for dairy milk — a 70% reduction. Almond and soy milk are also significantly lower.",
      category: "FOOD", impact: "Medium", icon: "🥛",
    },
  ],
  SHOPPING: [
    {
      id: "s1", type: "tip", title: "Buy Less, Choose Well",
      content: "The fashion industry produces 10% of global emissions. Buying 50% fewer clothes and wearing them twice as long cuts your fashion footprint by 75%.",
      category: "SHOPPING", impact: "High", icon: "👕",
    },
    {
      id: "s2", type: "recommendation", title: "Choose Refurbished Electronics",
      content: "Buying a refurbished laptop saves about 300 kg CO₂ — the same as driving 1,400 km. Refurbished devices work just as well at a fraction of the environmental cost.",
      category: "SHOPPING", impact: "High", icon: "💻",
    },
    {
      id: "s3", type: "tip", title: "Bring Reusable Bags",
      content: "A reusable cotton bag only needs to be used 131 times to offset its production footprint vs plastic. Canvas bags break even even faster.",
      category: "SHOPPING", impact: "Low", icon: "🛍️",
    },
  ],
  WATER: [
    {
      id: "w1", type: "tip", title: "Shorter Showers",
      content: "Reducing shower time from 8 to 5 minutes saves about 30 liters of water per shower and reduces associated energy for heating by 37%.",
      category: "WATER", impact: "Medium", icon: "🚿",
    },
    {
      id: "w2", type: "tip", title: "Fix Leaky Faucets",
      content: "A faucet dripping once per second wastes 11,000+ liters per year. Fixing leaks is one of the simplest and most cost-effective eco actions.",
      category: "WATER", impact: "Medium", icon: "🔧",
    },
  ],
  DEVICE: [
    {
      id: "d1", type: "tip", title: "Reduce Streaming Quality",
      content: "Watching in SD instead of 4K reduces streaming energy by up to 86%. Your eyes won't notice on a phone screen, but the planet will.",
      category: "DEVICE", impact: "Low", icon: "📺",
    },
    {
      id: "d2", type: "tip", title: "Enable Dark Mode",
      content: "Dark mode on OLED screens reduces display power consumption by up to 60%. Most modern phones and apps support it.",
      category: "DEVICE", impact: "Low", icon: "🌙",
    },
  ],
};

const GENERAL_INSIGHTS: AIInsight[] = [
  {
    id: "g1", type: "recommendation", title: "Start a Carbon Budget",
    content: "The average person needs to reduce emissions to 2.5 tonnes CO₂/year by 2030 to meet Paris Agreement goals. That's about 6.8 kg/day. Set a weekly budget to track progress!",
    icon: "🎯",
  },
  {
    id: "g2", type: "tip", title: "The 1% Rule",
    content: "Reducing your footprint by just 1% each week compounds to a 40% reduction over a year. Small consistent changes beat dramatic one-time efforts.",
    icon: "📈",
  },
  {
    id: "g3", type: "prediction", title: "Your Impact Multiplier",
    content: "Research shows that when one person makes visible sustainability changes, an average of 3 people in their social circle follow. Your actions ripple outward!",
    icon: "🌊",
  },
];

// ─── Analysis Engine ───────────────────────────────────────────────────────

interface ActivityData {
  category: string;
  co2Amount: number;
  date: Date;
  subCategory: string;
}

export function analyzeHabits(activities: ActivityData[]): AIInsight[] {
  const alerts: AIInsight[] = [];
  if (activities.length === 0) return alerts;

  // Group by category
  const byCat: Record<string, number> = {};
  for (const a of activities) {
    byCat[a.category] = (byCat[a.category] || 0) + a.co2Amount;
  }

  // Find highest emission category
  const sorted = Object.entries(byCat).sort(([, a], [, b]) => b - a);
  if (sorted.length > 0) {
    const [topCat, topVal] = sorted[0];
    const catInfo = CATEGORIES[topCat as keyof typeof CATEGORIES];
    alerts.push({
      id: `alert-top-${topCat}`,
      type: "alert",
      title: `${catInfo?.icon || "⚠️"} High ${catInfo?.label || topCat} Emissions`,
      content: `Your ${(catInfo?.label || topCat).toLowerCase()} activities contribute the most to your footprint at ${topVal.toFixed(1)} kg CO₂. Focus here for the biggest impact reduction.`,
      category: topCat,
      impact: "High",
      icon: "⚠️",
    });
  }

  // Check for frequent car usage
  const carTrips = activities.filter(
    (a) => a.category === "TRAVEL" && (a.subCategory === "car_petrol" || a.subCategory === "car_diesel"),
  );
  if (carTrips.length > 5) {
    alerts.push({
      id: "alert-car",
      type: "alert",
      title: "Frequent Car Usage Detected",
      content: `You've logged ${carTrips.length} car trips recently. Consider switching some to public transit or cycling to save ${(carTrips.reduce((s, a) => s + a.co2Amount, 0) * 0.6).toFixed(1)} kg CO₂.`,
      category: "TRAVEL",
      impact: "High",
      icon: "🚗",
    });
  }

  // Check for high meat consumption
  const meatActivities = activities.filter(
    (a) => a.category === "FOOD" && ["beef", "lamb", "pork"].includes(a.subCategory),
  );
  if (meatActivities.length > 3) {
    alerts.push({
      id: "alert-meat",
      type: "alert",
      title: "High Red Meat Consumption",
      content: `You've logged ${meatActivities.length} red meat entries. Switching to chicken or plant-based alternatives could reduce your food emissions by up to 70%.`,
      category: "FOOD",
      impact: "Very High",
      icon: "🥩",
    });
  }

  return alerts;
}

export function getPersonalizedTips(
  activities: ActivityData[],
  count: number = 6,
): AIInsight[] {
  const tips: AIInsight[] = [];

  // Get categories used by the user
  const usedCategories = [...new Set(activities.map((a) => a.category))];

  // Prioritize tips for high-emission categories
  const byCat: Record<string, number> = {};
  for (const a of activities) {
    byCat[a.category] = (byCat[a.category] || 0) + a.co2Amount;
  }
  const sorted = Object.entries(byCat).sort(([, a], [, b]) => b - a);

  // Add tips for top categories first
  for (const [cat] of sorted) {
    const catTips = ECO_TIPS[cat] || [];
    const unused = catTips.filter((t) => !tips.find((e) => e.id === t.id));
    if (unused.length > 0) {
      tips.push(unused[Math.floor(Math.random() * unused.length)]);
    }
    if (tips.length >= count) break;
  }

  // Fill with general insights
  if (tips.length < count) {
    const remaining = GENERAL_INSIGHTS.filter(
      (g) => !tips.find((t) => t.id === g.id),
    );
    tips.push(...remaining.slice(0, count - tips.length));
  }

  // Fill with random tips from unused categories
  if (tips.length < count) {
    const allCats = Object.keys(ECO_TIPS);
    const unusedCats = allCats.filter((c) => !usedCategories.includes(c));
    for (const cat of unusedCats) {
      const catTips = ECO_TIPS[cat];
      if (catTips.length > 0) {
        tips.push(catTips[Math.floor(Math.random() * catTips.length)]);
      }
      if (tips.length >= count) break;
    }
  }

  return tips.slice(0, count);
}

export function generateWeeklyReport(
  currentWeekActivities: ActivityData[],
  previousWeekActivities: ActivityData[],
): WeeklyReport {
  const totalCO2 = currentWeekActivities.reduce((s, a) => s + a.co2Amount, 0);
  const previousTotalCO2 = previousWeekActivities.reduce(
    (s, a) => s + a.co2Amount, 0,
  );

  const changePercent =
    previousTotalCO2 > 0
      ? Math.round(((totalCO2 - previousTotalCO2) / previousTotalCO2) * 100)
      : 0;

  // Find top category
  const byCat: Record<string, number> = {};
  for (const a of currentWeekActivities) {
    byCat[a.category] = (byCat[a.category] || 0) + a.co2Amount;
  }
  const topCategory =
    Object.entries(byCat).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  // Generate achievements
  const achievements: string[] = [];
  if (currentWeekActivities.length >= 7)
    achievements.push("Logged activities every day this week!");
  if (changePercent < 0)
    achievements.push(
      `Reduced emissions by ${Math.abs(changePercent)}% vs last week!`,
    );
  if (currentWeekActivities.some((a) => a.category === "TRAVEL" && a.subCategory === "bicycle"))
    achievements.push("Used bicycle for transportation!");
  if (currentWeekActivities.length >= 5)
    achievements.push("Active tracker — logged 5+ activities!");
  if (achievements.length === 0)
    achievements.push("Keep going! Every activity you track matters.");

  // Generate recommendations
  const recommendations: string[] = [];
  if (byCat["TRAVEL"] > totalCO2 * 0.4)
    recommendations.push("Try public transit for your highest-emission trips.");
  if (byCat["FOOD"] > totalCO2 * 0.3)
    recommendations.push("Add one meat-free day this week.");
  if (byCat["ELECTRICITY"] > totalCO2 * 0.3)
    recommendations.push("Unplug devices when not in use to cut standby power.");
  if (currentWeekActivities.length < 3)
    recommendations.push("Log more activities for better insights.");
  recommendations.push("Set a weekly CO₂ budget to stay on track.");

  // Calculate score (0-100)
  const dailyAvg = totalCO2 / 7;
  const score = Math.round(Math.max(0, Math.min(100, 100 - (dailyAvg / 22) * 50)));

  const now = new Date();
  const weekNum = Math.ceil(
    ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 +
      new Date(now.getFullYear(), 0, 1).getDay() + 1) / 7,
  );

  return {
    period: `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`,
    totalCO2: Math.round(totalCO2 * 100) / 100,
    previousTotalCO2: Math.round(previousTotalCO2 * 100) / 100,
    changePercent,
    topCategory,
    achievements,
    recommendations,
    score,
  };
}

export function getChatResponse(
  message: string,
  activities: ActivityData[],
): string {
  const lowerMsg = message.toLowerCase();

  // Carbon footprint questions
  if (lowerMsg.includes("footprint") || lowerMsg.includes("total") || lowerMsg.includes("how much")) {
    const total = activities.reduce((s, a) => s + a.co2Amount, 0);
    if (total === 0) {
      return "You haven't logged any activities yet! Start by tracking your travel, food, and energy usage. The average person produces about 8-16 kg of CO₂ per day depending on their lifestyle.";
    }
    return `Based on your logged activities, your total carbon footprint is **${total.toFixed(1)} kg CO₂**. The global average is about 4.7 tonnes per year (~12.9 kg/day). ${total / activities.length < 12.9 ? "You're doing better than average!" : "There's room for improvement — check your top emission category for the biggest impact."}`;
  }

  // Tips and recommendations
  if (lowerMsg.includes("tip") || lowerMsg.includes("reduce") || lowerMsg.includes("help") || lowerMsg.includes("suggest")) {
    const tips = getPersonalizedTips(activities, 3);
    if (tips.length === 0) {
      return "Here are some general eco tips:\n\n1. Use public transit when possible\n2. Try one meat-free meal per day\n3. Switch to LED bulbs\n4. Bring reusable bags\n5. Take shorter showers";
    }
    return `Here are personalized tips based on your habits:\n\n${tips.map((t, i) => `${i + 1}. **${t.title}**\n   ${t.content}`).join("\n\n")}`;
  }

  // Food related
  if (lowerMsg.includes("food") || lowerMsg.includes("eat") || lowerMsg.includes("diet") || lowerMsg.includes("meat")) {
    return "**Food & Diet Impact**\n\nFood accounts for ~25% of personal emissions. Here's a quick comparison:\n\n| Food | CO₂/kg |\n|------|--------|\n| Beef | 27.0 kg |\n| Lamb | 39.2 kg |\n| Chicken | 6.9 kg |\n| Tofu | 3.0 kg |\n| Vegetables | 2.0 kg |\n\n**Quick wins:**\n- Replace beef with chicken → **75% reduction**\n- Try 'Meatless Mondays' → save ~5 kg CO₂/week\n- Buy local produce → reduce transport emissions by 5-10x";
  }

  // Travel related
  if (lowerMsg.includes("travel") || lowerMsg.includes("car") || lowerMsg.includes("fly") || lowerMsg.includes("commute")) {
    return "**Travel Impact**\n\nTransport is typically the largest personal emission source:\n\n| Mode | CO₂/km |\n|------|--------|\n| Flight (short) | 0.255 kg |\n| Car (petrol) | 0.210 kg |\n| Bus | 0.089 kg |\n| Train | 0.041 kg |\n| E-bike | 0.022 kg |\n| Bicycle | 0 kg |\n\n**Key insight:** Switching from car to train for a 50 km commute saves **8.45 kg CO₂ per trip!**";
  }

  // Energy related
  if (lowerMsg.includes("energy") || lowerMsg.includes("electric") || lowerMsg.includes("power")) {
    return "**Energy Impact**\n\nHome energy is 15-25% of personal emissions:\n\n**Top energy savers:**\n1. Switch to green energy provider → **up to 95% reduction**\n2. Install a smart thermostat → save 150 kg CO₂/year\n3. Switch to LED bulbs → save 200 kg CO₂/year\n4. Unplug phantom loads → save 5-10% on electricity\n5. Wash clothes in cold water → save 0.5 kg CO₂ per load";
  }

  // Greeting
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
    return "Hello! I'm your AI Sustainability Assistant. I can help you:\n\n**Analyze** your carbon footprint\n**Suggest** ways to reduce emissions\n**Track** your progress\n**Learn** about sustainable living\n\nTry asking:\n- \"How can I reduce my footprint?\"\n- \"Tell me about food emissions\"\n- \"What's my biggest impact area?\"";
  }

  // Default
  return "Great question! Here are some things I can help with:\n\n- **\"Show me tips\"** — Get personalized eco recommendations\n- **\"Tell me about food/travel/energy\"** — Learn about specific areas\n- **\"How much is my footprint?\"** — See your total impact\n- **\"How can I reduce?\"** — Get actionable suggestions\n\nI analyze your activity data to provide personalized insights. The more you log, the better my recommendations become!";
}
