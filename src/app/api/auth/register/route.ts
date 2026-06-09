import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/schemas";

// ─── In-Memory Rate Limiter ─────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/** POST /api/auth/register — Create a new user account */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (email === "demo@carbonwise.app") {
        try {
          const { seedDemoUserData } = await import("@/lib/db-seed-helper");
          await seedDemoUserData("demo-user-id");
          return NextResponse.json(
            { message: "Demo account seeded successfully", userId: "demo-user-id" },
            { status: 201 },
          );
        } catch (err) {
          console.error("Error seeding demo user:", err);
        }
      }
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    let createdUserId = "";

    if (email === "demo@carbonwise.app") {
      const { seedDemoUserData } = await import("@/lib/db-seed-helper");
      const user = await seedDemoUserData("demo-user-id");
      createdUserId = user.id;
    } else {
      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });
      createdUserId = user.id;

      // Create default user profile
      await prisma.userProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json(
      { message: "Account created successfully", userId: createdUserId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
