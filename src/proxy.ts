import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const protectedPaths = [
    "/dashboard",
    "/tracker",
    "/insights",
    "/challenges",
    "/community",
    "/profile",
    "/settings",
  ];

  const authPaths = ["/login", "/register"];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );
  const isAuthPage = authPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );

  // Redirect to login if accessing protected route while not authenticated
  if (isProtected && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl),
    );
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons|images).*)",
  ],
};
