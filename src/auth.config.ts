import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Edge-compatible auth configuration.
 * Separated from auth.ts to allow middleware usage without Prisma
 * (Prisma doesn't run on the Edge runtime).
 */
export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Actual verification happens in auth.ts — this is just the edge-safe shell
        if (!credentials?.email || !credentials?.password) return null;
        return null; // Will be overridden in auth.ts
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/dashboard",
        "/tracker",
        "/insights",
        "/challenges",
        "/community",
        "/profile",
        "/settings",
      ];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path),
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
