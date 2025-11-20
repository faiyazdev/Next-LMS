import { UserRole } from "@/drizzle/schema";

export function canCreateCourses(role: UserRole) {
  return role === "admin";
}

export function canDeleteCourses(role: UserRole) {
  return role === "admin";
}
