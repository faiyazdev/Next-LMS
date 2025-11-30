import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/",
  "/products(.*)",
  "/courses/:id/lessons/:id",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  if (isAdminRoute(req)) {
    if (!(sessionClaims?.role === "admin")) {
      return notFound();
    }
  }

  if (isAuthRoute(req)) {
    // if user is signed in and tries to access a public route, redirect based on role
    if (userId) {
      if (sessionClaims?.role === "admin") {
        const adminUrl = new URL("/admin", req.url);
        return NextResponse.redirect(adminUrl);
      } else {
        const rootUrl = new URL("/", req.url);
        return NextResponse.redirect(rootUrl);
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
