import { authMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/stripe", "/testing.jpg"],
  ignoredRoutes: ["/api/stripe", "/%3Cno%20source%3E"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
