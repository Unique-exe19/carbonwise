import {
  getDashboardStats,
  getCarbonTrends,
  getCategoryBreakdown,
  getRecentActivities,
} from "../actions/dashboard";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

jest.mock("../auth", () => ({
  auth: jest.fn(),
}));

jest.mock("../lib/prisma", () => ({
  prisma: {
    userProfile: {
      findUnique: jest.fn(),
    },
    carbonActivity: {
      aggregate: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

describe("Dashboard Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDashboardStats", () => {
    it("should return null if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getDashboardStats();
      expect(res).toBeNull();
    });

    it("should return aggregated stats for authenticated user", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id", name: "John" } });
      (prisma.userProfile.findUnique as jest.Mock).mockResolvedValue({
        currentStreak: 5,
        xp: 120,
        level: 2,
      });
      (prisma.carbonActivity.aggregate as jest.Mock)
        .mockResolvedValueOnce({ _sum: { co2Amount: 150 } }) // total
        .mockResolvedValueOnce({ _sum: { co2Amount: 10 } })  // today
        .mockResolvedValueOnce({ _sum: { co2Amount: 40 } })  // week
        .mockResolvedValueOnce({ _sum: { co2Amount: 100 } }) // month
        .mockResolvedValueOnce({ _sum: { co2Amount: 120 } }); // prev month
      (prisma.carbonActivity.count as jest.Mock).mockResolvedValue(15);

      const res = await getDashboardStats();
      expect(res).toEqual({
        totalCO2: 150,
        todayCO2: 10,
        weekCO2: 40,
        monthCO2: 100,
        reductionPercent: 17, // (120 - 100) / 120 = 16.67% -> 17
        activitiesCount: 15,
        currentStreak: 5,
        xp: 120,
        level: 2,
        userName: "John",
      });
    });
  });

  describe("getCarbonTrends", () => {
    it("should return empty array if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getCarbonTrends();
      expect(res).toEqual([]);
    });

    it("should return formatted trends grouped by date", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      
      const mockActivities = [
        { date: new Date(), co2Amount: 10 },
      ];
      (prisma.carbonActivity.findMany as jest.Mock).mockResolvedValue(mockActivities);

      const res = await getCarbonTrends(7);
      expect(res.length).toBe(7);
      expect(res[0]).toHaveProperty("date");
      expect(res[0]).toHaveProperty("co2");
      expect(res[0]).toHaveProperty("label");
    });
  });

  describe("getCategoryBreakdown", () => {
    it("should return empty array if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getCategoryBreakdown();
      expect(res).toEqual([]);
    });

    it("should return aggregated category breakdown list", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      (prisma.carbonActivity.groupBy as jest.Mock).mockResolvedValue([
        { category: "TRAVEL", _sum: { co2Amount: 80 } },
        { category: "FOOD", _sum: { co2Amount: 20 } },
      ]);

      const res = await getCategoryBreakdown();
      expect(res.length).toBe(2);
      expect(res[0]).toHaveProperty("category");
      expect(res[0]).toHaveProperty("label");
      expect(res[0]).toHaveProperty("co2");
      expect(res[0]).toHaveProperty("percentage");
      expect(res[0]).toHaveProperty("color");
      expect(res[0]).toHaveProperty("icon");
      expect(res[0].percentage).toBe(80);
      expect(res[1].percentage).toBe(20);
    });
  });

  describe("getRecentActivities", () => {
    it("should return empty array if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getRecentActivities();
      expect(res).toEqual([]);
    });

    it("should return recent activities list", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      const mockActivities = [
        {
          id: "act-1",
          category: "TRAVEL",
          subCategory: "car_petrol",
          value: 10,
          unit: "km",
          co2Amount: 1.7,
          date: new Date(),
          notes: null,
        },
      ];
      (prisma.carbonActivity.findMany as jest.Mock).mockResolvedValue(mockActivities);

      const res = await getRecentActivities(5);
      expect(res.length).toBe(1);
      expect(res[0].id).toBe("act-1");
      expect(res[0].category).toBe("TRAVEL");
      expect(res[0].co2Amount).toBe(1.7);
    });
  });
});
