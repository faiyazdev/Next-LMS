import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

import { env } from "./env/server";
import { setUserCountryHeader } from "./lib/userCountryHeader";
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

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  const decision = await aj.protect(
    env.TEST_IP_ADDRESS
      ? { ...req, ip: env.TEST_IP_ADDRESS, headers: req.headers }
      : req,
    { requested: 5 }
  ); // Deduct 5 tokens from the bucket

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
  }
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

  if (!decision.ip.isVpn() && !decision.ip.isProxy()) {
    const headers = new Headers(req.headers);
    setUserCountryHeader(headers, decision.ip.country);
    console.log(decision.ip.country);
    return NextResponse.next({ request: { headers } });
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
