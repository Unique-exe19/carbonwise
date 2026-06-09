import { z } from "zod";

export const createActivitySchema = z.object({
  category: z.enum([
    "TRAVEL",
    "ELECTRICITY",
    "FOOD",
    "SHOPPING",
    "WATER",
    "DEVICE",
  ]),
  subCategory: z.string().min(1, "Sub-category is required"),
  value: z.number().positive("Value must be positive"),
  unit: z.string().min(1),
  date: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  dietType: z
    .enum(["VEGAN", "VEGETARIAN", "PESCATARIAN", "MIXED", "HEAVY_MEAT"])
    .optional(),
  householdSize: z.number().int().min(1).max(20).optional(),
  transportMode: z
    .enum(["CAR", "ELECTRIC_CAR", "PUBLIC_TRANSIT", "BICYCLE", "WALKING"])
    .optional(),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000),
  type: z.enum(["PROGRESS", "ACHIEVEMENT", "CHALLENGE", "TIP", "DISCUSSION"]).default("PROGRESS"),
});

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1, "Comment cannot be empty").max(500),
});

export const createGoalSchema = z.object({
  title: z.string().min(3).max(100),
  targetCO2: z.number().positive("Target must be positive"),
  startDate: z.string(),
  endDate: z.string(),
});
