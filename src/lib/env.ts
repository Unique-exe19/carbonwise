import { z } from "zod";

/**
 * Environment variable validation — fails fast at startup if any required
 * variable is missing or malformed.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    const isBuild = process.env.NEXT_PHASE === "phase-production-build";
    const isTest = process.env.NODE_ENV === "test";
    if (!isBuild && !isTest) {
      throw new Error("Invalid environment variables");
    }
  }
  return (parsed.data || {}) as Env;
}

export const env = validateEnv();
