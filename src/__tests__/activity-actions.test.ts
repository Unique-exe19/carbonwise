import { createActivity, getActivities, deleteActivity } from "../actions/activity";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

jest.mock("../auth", () => ({
  auth: jest.fn(),
}));

jest.mock("../lib/prisma", () => ({
  prisma: {
    carbonActivity: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
    userProfile: {
      update: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Activity Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createActivity", () => {
    it("should return error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await createActivity({
        category: "TRAVEL",
        subCategory: "car_petrol",
        value: 10,
      });
      expect(res).toEqual({ error: "Not authenticated" });
    });

    it("should validate inputs and create carbon activity", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      const mockActivity = { id: "activity-1", userId: "test-user-id" };
      (prisma.carbonActivity.create as jest.Mock).mockResolvedValue(mockActivity);
      (prisma.userProfile.update as jest.Mock).mockResolvedValue({});

      const res = await createActivity({
        category: "TRAVEL",
        subCategory: "car_petrol",
        value: 100,
        notes: "roadtrip",
      });

      expect(res.success).toBe(true);
      expect(res.activity).toEqual(mockActivity);
      expect(prisma.carbonActivity.create).toHaveBeenCalled();
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId: "test-user-id" },
        data: { xp: { increment: 10 } },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("getActivities", () => {
    it("should return error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getActivities();
      expect(res.error).toBe("Not authenticated");
    });

    it("should fetch activities list and count total", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      const mockActivities = [{ id: "act-1" }, { id: "act-2" }];
      (prisma.carbonActivity.findMany as jest.Mock).mockResolvedValue(mockActivities);
      (prisma.carbonActivity.count as jest.Mock).mockResolvedValue(2);

      const res = await getActivities({ page: 1, limit: 10 });
      expect(res.activities).toEqual(mockActivities);
      expect(res.total).toBe(2);
      expect(prisma.carbonActivity.findMany).toHaveBeenCalled();
    });
  });

  describe("deleteActivity", () => {
    it("should return error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await deleteActivity("act-1");
      expect(res).toEqual({ error: "Not authenticated" });
    });

    it("should delete activity for authenticated user", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "test-user-id" } });
      (prisma.carbonActivity.delete as jest.Mock).mockResolvedValue({});

      const res = await deleteActivity("act-1");
      expect(res.success).toBe(true);
      expect(prisma.carbonActivity.delete).toHaveBeenCalledWith({
        where: { id: "act-1", userId: "test-user-id" },
      });
    });
  });
});
