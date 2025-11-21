"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { canAccessAdminPages } from "@/permissions/canAccessAdminPages";
import { ModeToggle } from "@/components/toggle-mode";

export default function ConsumerNavbar() {
  return (
    <header className="w-full sticky z-50 top-0 left-0 border-b bg-background/95 py-4">
      <div className="px-4 sm:px-8 mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Next LMS</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center text-sm gap-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>

          {/* Admin link (conditionally shown) */}
          <AdminLink />

          <Link
            href="/courses"
            className="hover:text-primary transition-colors"
          >
            My Courses
          </Link>
          <Link
            href="/purchases"
            className="hover:text-primary transition-colors"
          >
            Purchase History
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Button asChild className="cursor-pointer" variant="ghost">
              <SignInButton>Login</SignInButton>
            </Button>
            <Button
              variant={"default"}
              className="text-black cursor-pointer bg-gray-100 rounded-full px-5"
              asChild
            >
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Next LMS</SheetTitle>
              </SheetHeader>

              <nav className="flex px-4 flex-col gap-4 mt-6 text-lg font-medium">
                <Link href="/">Home</Link>
                <Link href="/courses">Courses</Link>
                <Link href="/about">About</Link>
              </nav>

              <div className="mt-6 px-4 flex flex-col gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/** Client-only AdminLink: uses Clerk's useUser hook */
function AdminLink() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) return null;

  // adjust this if your role is stored elsewhere (e.g. user.role)
  const role = user.publicMetadata.role;

  if (!role) return null;

  // only render if role has admin access
  if (!canAccessAdminPages(role)) return null;

  return (
    <Link href="/admin" className="hover:text-primary transition-colors">
      Admin
    </Link>
  );
}
