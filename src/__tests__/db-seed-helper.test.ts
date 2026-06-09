import { seedDemoUserData } from "../lib/db-seed-helper";
import { prisma } from "../lib/prisma";

jest.mock("../lib/prisma", () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
      },
      userProfile: {
        upsert: jest.fn(),
      },
      carbonActivity: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      badge: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
      },
      userBadge: {
        upsert: jest.fn(),
      },
    },
  };
});

describe("db-seed-helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should seed demo user and activities successfully", async () => {
    // Mock user.findUnique returning null (demo user doesn't exist yet with that email)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    
    // Mock user.upsert returning the user object
    const mockUser = { id: "demo-user-id", email: "demo@carbonwise.app", name: "Demo User" };
    (prisma.user.upsert as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock userProfile.upsert returning profile
    (prisma.userProfile.upsert as jest.Mock).mockResolvedValue({ userId: "demo-user-id" });
    
    // Mock carbonActivity deleteMany/createMany
    (prisma.carbonActivity.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.carbonActivity.createMany as jest.Mock).mockResolvedValue({ count: 90 });
    
    // Mock badge.upsert and badge.findUnique
    (prisma.badge.upsert as jest.Mock).mockResolvedValue({});
    (prisma.badge.findUnique as jest.Mock).mockImplementation(({ where }) => {
      return Promise.resolve({ id: `${where.name}-id`, name: where.name });
    });
    
    // Mock userBadge.upsert
    (prisma.userBadge.upsert as jest.Mock).mockResolvedValue({});

    const result = await seedDemoUserData("demo-user-id");

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "demo@carbonwise.app" },
    });
    expect(prisma.user.upsert).toHaveBeenCalled();
    expect(prisma.userProfile.upsert).toHaveBeenCalled();
    expect(prisma.carbonActivity.deleteMany).toHaveBeenCalledWith({
      where: { userId: "demo-user-id" },
    });
    expect(prisma.carbonActivity.createMany).toHaveBeenCalled();
    expect(prisma.badge.upsert).toHaveBeenCalled();
    expect(prisma.userBadge.upsert).toHaveBeenCalled();
  });

  it("should delete existing demo user if ID is different", async () => {
    // Mock user.findUnique returning an existing user with a different ID
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "old-random-id",
      email: "demo@carbonwise.app",
    });
    
    const mockUser = { id: "demo-user-id", email: "demo@carbonwise.app" };
    (prisma.user.upsert as jest.Mock).mockResolvedValue(mockUser);
    (prisma.user.delete as jest.Mock).mockResolvedValue({});
    (prisma.userProfile.upsert as jest.Mock).mockResolvedValue({});
    (prisma.carbonActivity.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.carbonActivity.createMany as jest.Mock).mockResolvedValue({});
    (prisma.badge.upsert as jest.Mock).mockResolvedValue({});
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue({ id: "badge-id" });
    (prisma.userBadge.upsert as jest.Mock).mockResolvedValue({});

    await seedDemoUserData("demo-user-id");

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: "old-random-id" },
    });
    expect(prisma.user.upsert).toHaveBeenCalled();
  });
});
