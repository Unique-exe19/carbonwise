import { getAIInsights, chatWithAI } from "../actions/ai";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";

jest.mock("../auth", () => ({
  auth: jest.fn(),
}));

jest.mock("../lib/prisma", () => ({
  prisma: {
    carbonActivity: {
      findMany: jest.fn(),
    },
  },
}));

describe("AI Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAIInsights", () => {
    it("should return empty insights if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await getAIInsights();
      expect(res).toEqual({ tips: [], alerts: [], report: null });
    });

    it("should fetch activities and return computed insights", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "user-123" } });
      (prisma.carbonActivity.findMany as jest.Mock).mockResolvedValue([]);

      const res = await getAIInsights();
      expect(res).toHaveProperty("tips");
      expect(res).toHaveProperty("alerts");
      expect(res).toHaveProperty("report");
      expect(prisma.carbonActivity.findMany).toHaveBeenCalledTimes(3);
    });
  });

  describe("chatWithAI", () => {
    it("should return auth prompt if not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const res = await chatWithAI("Hello");
      expect(res).toEqual({ response: "Please sign in to chat." });
    });

    it("should consult local AI service and return response", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: "user-123" } });
      (prisma.carbonActivity.findMany as jest.Mock).mockResolvedValue([]);

      const res = await chatWithAI("What can I do for food emissions?");
      expect(res).toHaveProperty("response");
      expect(typeof res.response).toBe("string");
      expect(prisma.carbonActivity.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
