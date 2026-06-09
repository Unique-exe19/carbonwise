import {
  createActivitySchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  createPostSchema,
  createCommentSchema,
  createGoalSchema,
} from "../lib/validations/schemas";

describe("Zod Validation Schemas", () => {
  describe("createActivitySchema", () => {
    it("should validate valid inputs successfully", () => {
      const valid = {
        category: "TRAVEL",
        subCategory: "car_petrol",
        value: 12.5,
        unit: "km",
        notes: "Commute to work",
      };
      const result = createActivitySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail validation on invalid category", () => {
      const invalid = {
        category: "PLANE", // Not in enum
        subCategory: "air",
        value: 10,
        unit: "km",
      };
      const result = createActivitySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should fail validation on non-positive value", () => {
      const invalid = {
        category: "TRAVEL",
        subCategory: "car_petrol",
        value: -5,
        unit: "km",
      };
      const result = createActivitySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login fields", () => {
      const valid = {
        email: "test@example.com",
        password: "password123",
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on invalid email", () => {
      const invalid = {
        email: "not-an-email",
        password: "password123",
      };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should fail on short password", () => {
      const invalid = {
        email: "test@example.com",
        password: "123",
      };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should validate correct registration fields", () => {
      const valid = {
        name: "Eco Warrior",
        email: "test@example.com",
        password: "password123",
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on short name", () => {
      const invalid = {
        name: "E",
        email: "test@example.com",
        password: "password123",
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("updateProfileSchema", () => {
    it("should validate partial update fields", () => {
      const valid = {
        name: "New Name",
        dietType: "VEGAN",
      };
      const result = updateProfileSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on invalid dietType or transportMode", () => {
      const invalid = {
        dietType: "MEAT_ONLY", // Invalid enum
      };
      const result = updateProfileSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("createPostSchema", () => {
    it("should validate correct community post", () => {
      const valid = {
        title: "My Carbon Reduction",
        content: "I saved 50kg of carbon this week by cycling to work every single day!",
        type: "PROGRESS",
      };
      const result = createPostSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on very short content", () => {
      const invalid = {
        title: "Short",
        content: "Too short", // min 10 chars
      };
      const result = createPostSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("createCommentSchema", () => {
    it("should validate correct comments", () => {
      const valid = {
        postId: "p1",
        content: "Great job!",
      };
      const result = createCommentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on empty comment", () => {
      const invalid = {
        postId: "p1",
        content: "",
      };
      const result = createCommentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("createGoalSchema", () => {
    it("should validate correct carbon reduction goal", () => {
      const valid = {
        title: "Reduce Travel Carbon",
        targetCO2: 20.5,
        startDate: "2026-06-01",
        endDate: "2026-06-30",
      };
      const result = createGoalSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should fail on non-positive target", () => {
      const invalid = {
        title: "Reduce Travel Carbon",
        targetCO2: -2,
        startDate: "2026-06-01",
        endDate: "2026-06-30",
      };
      const result = createGoalSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
