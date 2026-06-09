import {
  getPersonalizedTips,
  analyzeHabits,
  generateWeeklyReport,
  getChatResponse,
} from "../services/ai-service";

describe("AI Sustainability Service", () => {
  const mockActivities = [
    {
      category: "TRAVEL",
      subCategory: "car_petrol",
      co2Amount: 25.0,
      date: new Date(),
    },
    {
      category: "FOOD",
      subCategory: "beef",
      co2Amount: 10.0,
      date: new Date(),
    },
    {
      category: "ELECTRICITY",
      subCategory: "grid_average",
      co2Amount: 50.0,
      date: new Date(),
    },
  ];

  describe("getPersonalizedTips", () => {
    it("should return general tips when no activities are provided", () => {
      const tips = getPersonalizedTips([], 3);
      expect(tips.length).toBe(3);
    });

    it("should prioritize tips matching top emission categories", () => {
      const tips = getPersonalizedTips(mockActivities, 3);
      expect(tips.length).toBeGreaterThan(0);
      expect(tips.some(t => t.category === "ELECTRICITY" || t.category === "TRAVEL")).toBe(true);
    });
  });

  describe("analyzeHabits", () => {
    it("should detect anomalies or suggest improvements based on high emissions", () => {
      const alerts = analyzeHabits(mockActivities);
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe("generateWeeklyReport", () => {
    it("should generate a structured weekly performance report", () => {
      const currentWeek = [
        { category: "TRAVEL", subCategory: "car_petrol", co2Amount: 10, date: new Date() },
      ];
      const previousWeek = [
        { category: "TRAVEL", subCategory: "car_petrol", co2Amount: 20, date: new Date() },
      ];

      const report = generateWeeklyReport(currentWeek, previousWeek);
      expect(report).toHaveProperty("totalCO2");
      expect(report).toHaveProperty("previousTotalCO2");
      expect(report.changePercent).toBe(-50); // (10 - 20) / 20 * 100
    });
  });

  describe("getChatResponse", () => {
    it("should return friendly rule-based response containing recommendations", () => {
      const response = getChatResponse("What is my travel impact?", mockActivities);
      expect(typeof response).toBe("string");
      expect(response.toLowerCase()).toContain("travel");
    });
  });
});
