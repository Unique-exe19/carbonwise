import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
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
