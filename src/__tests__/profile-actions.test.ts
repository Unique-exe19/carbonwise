import { getProfileSettings, updateProfileSettings } from "../actions/profile";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

jest.mock("../auth", () => ({
  auth: jest.fn(),
}));

jest.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    userProfile: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Profile Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfileSettings", () => {
    it("should return error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getProfileSettings();
      expect(res).toEqual({ error: "Not authenticated" });
    });

    it("should fetch user name and profile settings", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "user-123" } });
      const mockUser = {
        name: "Test User",
        email: "test@example.com",
        profile: {
          dietType: "VEGAN",
          transportMode: "BICYCLE",
        },
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const res = await getProfileSettings();
      expect(res).toEqual({
        success: true,
        name: "Test User",
        email: "test@example.com",
        dietType: "VEGAN",
        transportMode: "BICYCLE",
      });
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });
  });

  describe("updateProfileSettings", () => {
    it("should return error if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await updateProfileSettings({ name: "New Name" });
      expect(res).toEqual({ error: "Not authenticated" });
    });

    it("should update name and profile preferences", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "user-123" } });
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (prisma.userProfile.upsert as jest.Mock).mockResolvedValue({});

      const res = await updateProfileSettings({
        name: "New Name",
        dietType: "VEGAN",
        transportMode: "BICYCLE",
      });

      expect(res.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { name: "New Name" },
      });
      expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        update: {
          dietType: "VEGAN",
          transportMode: "BICYCLE",
        },
        create: {
          userId: "user-123",
          dietType: "VEGAN",
          transportMode: "BICYCLE",
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/settings");
    });
  });
});
