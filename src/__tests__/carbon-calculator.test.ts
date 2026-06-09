import {
  calculateTravelEmission,
  calculateElectricityEmission,
  calculateFoodEmission,
  calculateShoppingEmission,
  calculateWaterEmission,
  calculateDeviceEmission,
  calculateEmission,
  getEnvironmentalEquivalents,
  getSustainabilityScore,
  getSubCategories,
  getSubCategoryUnit,
} from "../services/carbon-calculator";

describe("Carbon Calculator Service", () => {
  describe("calculateTravelEmission", () => {
    it("should calculate correct carbon emissions for petrol car", () => {
      // Petrol car emission factor is typically around 0.17
      const emission = calculateTravelEmission("car_petrol", 100);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });

    it("should return 0 for invalid subcategory", () => {
      const emission = calculateTravelEmission("invalid_sub" as unknown as "walking", 100);
      expect(emission).toBe(0);
    });
  });

  describe("calculateElectricityEmission", () => {
    it("should calculate correct electricity emissions", () => {
      const emission = calculateElectricityEmission("grid_average", 200);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });
  });

  describe("calculateFoodEmission", () => {
    it("should calculate correct food emissions", () => {
      const emission = calculateFoodEmission("beef", 2);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });
  });

  describe("calculateShoppingEmission", () => {
    it("should calculate correct shopping emissions", () => {
      const emission = calculateShoppingEmission("clothing_tshirt", 3);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });
  });

  describe("calculateWaterEmission", () => {
    it("should calculate correct water emissions", () => {
      const emission = calculateWaterEmission("tap_water", 1000);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });
  });

  describe("calculateDeviceEmission", () => {
    it("should calculate correct device emissions", () => {
      const emission = calculateDeviceEmission("laptop", 10);
      expect(emission).toBeGreaterThan(0);
      expect(typeof emission).toBe("number");
    });
  });

  describe("calculateEmission Dispatcher", () => {
    it("should dispatch correctly for TRAVEL", () => {
      const emission = calculateEmission("TRAVEL", "car_petrol", 50);
      const direct = calculateTravelEmission("car_petrol", 50);
      expect(emission).toBe(direct);
    });

    it("should dispatch correctly for FOOD", () => {
      const emission = calculateEmission("FOOD", "beef", 1);
      const direct = calculateFoodEmission("beef", 1);
      expect(emission).toBe(direct);
    });

    it("should return 0 for unknown category", () => {
      const emission = calculateEmission("UNKNOWN", "sub", 10);
      expect(emission).toBe(0);
    });
  });

  describe("getEnvironmentalEquivalents", () => {
    it("should return correct conversion metrics", () => {
      const equivalents = getEnvironmentalEquivalents(100); // 100 kg CO2
      expect(equivalents).toHaveProperty("treesNeeded");
      expect(equivalents).toHaveProperty("carKm");
      expect(equivalents).toHaveProperty("smartphoneCharges");
      expect(equivalents).toHaveProperty("ledHours");
      expect(equivalents).toHaveProperty("waterBoiled");
      expect(equivalents.treesNeeded).toBeGreaterThan(0);
    });
  });

  describe("getSustainabilityScore", () => {
    it("should return Excellent for low daily emissions", () => {
      const scoreData = getSustainabilityScore(5); // 5 kg (very low)
      expect(scoreData.score).toBeGreaterThanOrEqual(80);
      expect(scoreData.label).toBe("Excellent");
    });

    it("should return Needs Improvement for very high emissions", () => {
      const scoreData = getSustainabilityScore(50); // 50 kg (very high)
      expect(scoreData.score).toBeLessThanOrEqual(20);
      expect(scoreData.label).toBe("Needs Improvement");
    });
  });

  describe("getSubCategoryUnit", () => {
    it("should return correct unit for valid category and subcategory", () => {
      expect(getSubCategoryUnit("TRAVEL", "car_petrol")).toBe("km");
      expect(getSubCategoryUnit("FOOD", "beef")).toBe("kg");
    });

    it("should return fallback units for invalid category or subcategory", () => {
      expect(getSubCategoryUnit("INVALID", "sub")).toBe("units");
      expect(getSubCategoryUnit("TRAVEL", "invalid_sub")).toBe("units");
    });
  });

  describe("getSubCategories", () => {
    it("should return list of subcategories for valid category", () => {
      const subs = getSubCategories("TRAVEL");
      expect(subs.length).toBeGreaterThan(0);
      expect(subs[0]).toHaveProperty("value");
      expect(subs[0]).toHaveProperty("label");
      expect(subs[0]).toHaveProperty("icon");
      expect(subs[0]).toHaveProperty("unit");
    });

    it("should return empty array for invalid category", () => {
      const subs = getSubCategories("INVALID");
      expect(subs).toEqual([]);
    });
  });
});
