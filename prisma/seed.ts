import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);
  
  const existingDemoUser = await prisma.user.findUnique({
    where: { email: "demo@carbonwise.app" },
  });
  if (existingDemoUser && existingDemoUser.id !== "demo-user-id") {
    await prisma.user.delete({ where: { id: existingDemoUser.id } });
  }

  const user = await prisma.user.upsert({
    where: { email: "demo@carbonwise.app" },
    update: {
      name: "Demo User",
      email: "demo@carbonwise.app",
      hashedPassword,
      role: "USER",
    },
    create: {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@carbonwise.app",
      hashedPassword,
      role: "USER",
    },
  });

  // Create profile
  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      bio: "Passionate about sustainability! 🌿",
      location: "San Francisco, CA",
      dietType: "MIXED",
      householdSize: 2,
      transportMode: "CAR",
      xp: 450,
      level: 3,
      totalCO2Saved: 42.5,
      currentStreak: 7,
      longestStreak: 14,
    },
  });

  // Seed sample activities for the last 30 days
  const categories = [
    { category: "TRAVEL", subCategory: "car_petrol", value: 25, unit: "km", co2: 5.25 },
    { category: "TRAVEL", subCategory: "bus", value: 15, unit: "km", co2: 1.34 },
    { category: "TRAVEL", subCategory: "train", value: 40, unit: "km", co2: 1.64 },
    { category: "TRAVEL", subCategory: "bicycle", value: 8, unit: "km", co2: 0 },
    { category: "ELECTRICITY", subCategory: "grid_average", value: 12, unit: "kWh", co2: 5.04 },
    { category: "ELECTRICITY", subCategory: "grid_average", value: 8, unit: "kWh", co2: 3.36 },
    { category: "FOOD", subCategory: "beef", value: 0.3, unit: "kg", co2: 8.1 },
    { category: "FOOD", subCategory: "chicken", value: 0.5, unit: "kg", co2: 3.45 },
    { category: "FOOD", subCategory: "vegetables", value: 1.0, unit: "kg", co2: 2.0 },
    { category: "FOOD", subCategory: "dairy_milk", value: 0.5, unit: "liter", co2: 1.6 },
    { category: "SHOPPING", subCategory: "clothing_tshirt", value: 1, unit: "item", co2: 7.0 },
    { category: "WATER", subCategory: "shower_8min", value: 2, unit: "session", co2: 0.64 },
    { category: "DEVICE", subCategory: "laptop", value: 6, unit: "hour", co2: 0.11 },
    { category: "DEVICE", subCategory: "streaming_video", value: 3, unit: "hour", co2: 0.11 },
  ];

  // Delete existing activities for demo user
  await prisma.carbonActivity.deleteMany({ where: { userId: user.id } });

  // Create activities spread over the last 30 days
  const activities = [];
  for (let day = 0; day < 30; day++) {
    // Pick 2-4 random activities per day
    const count = 2 + Math.floor(Math.random() * 3);
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - day);
    dayDate.setHours(
      8 + Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 60),
    );

    for (let j = 0; j < count; j++) {
      const template = categories[Math.floor(Math.random() * categories.length)];
      const variance = 0.7 + Math.random() * 0.6; // ±30% variance
      activities.push({
        userId: user.id,
        category: template.category,
        subCategory: template.subCategory,
        value: Math.round(template.value * variance * 10) / 10,
        unit: template.unit,
        co2Amount: Math.round(template.co2 * variance * 100) / 100,
        date: dayDate,
      });
    }
  }

  await prisma.carbonActivity.createMany({ data: activities });
  console.log(`  ✅ Created ${activities.length} sample activities`);

  // Create badges
  const badges = [
    { name: "First Step", description: "Logged your first activity", icon: "🌱", category: "SPECIAL", requirement: '{"type":"activities","threshold":1}', xpReward: 10 },
    { name: "Eco Curious", description: "Explored all 6 categories", icon: "🔍", category: "SPECIAL", requirement: '{"type":"categories","threshold":6}', xpReward: 25 },
    { name: "Streak Starter", description: "Maintained a 3-day streak", icon: "🔥", category: "STREAK", requirement: '{"type":"streak","threshold":3}', xpReward: 30 },
    { name: "Week Warrior", description: "7-day logging streak", icon: "⚡", category: "STREAK", requirement: '{"type":"streak","threshold":7}', xpReward: 50 },
    { name: "Carbon Cutter", description: "Reduced emissions 10% in a week", icon: "✂️", category: "REDUCTION", requirement: '{"type":"reduction","threshold":10}', xpReward: 40 },
    { name: "Green Champion", description: "Reduced emissions 25% in a month", icon: "🏆", category: "REDUCTION", requirement: '{"type":"reduction","threshold":25}', xpReward: 75 },
    { name: "Community Voice", description: "Made your first community post", icon: "📢", category: "COMMUNITY", requirement: '{"type":"posts","threshold":1}', xpReward: 15 },
    { name: "Challenge Accepted", description: "Joined your first challenge", icon: "🎯", category: "CHALLENGE", requirement: '{"type":"challenges","threshold":1}', xpReward: 20 },
    { name: "Eco Master", description: "Reached Level 5", icon: "🌟", category: "SPECIAL", requirement: '{"type":"level","threshold":5}', xpReward: 100 },
    { name: "Planet Hero", description: "Saved over 100 kg CO₂", icon: "🌍", category: "REDUCTION", requirement: '{"type":"saved","threshold":100}', xpReward: 150 },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log(`  ✅ Created ${badges.length} badges`);

  // Award first badges to demo user
  const firstBadge = await prisma.badge.findUnique({ where: { name: "First Step" } });
  const streakBadge = await prisma.badge.findUnique({ where: { name: "Streak Starter" } });

  if (firstBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: user.id, badgeId: firstBadge.id } },
      update: {},
      create: { userId: user.id, badgeId: firstBadge.id },
    });
  }
  if (streakBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: user.id, badgeId: streakBadge.id } },
      update: {},
      create: { userId: user.id, badgeId: streakBadge.id },
    });
  }
  console.log("  ✅ Awarded demo user badges");

  console.log("\n🎉 Seed complete! Demo account:");
  console.log("   Email:    demo@carbonwise.app");
  console.log("   Password: demo1234\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
