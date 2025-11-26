import { UserRole } from "@/drizzle/schema";

export function canCreateLesson(role: UserRole) {
  return role === "admin";
}
export function canUpdateLesson(role: UserRole) {
  return role === "admin";
}
export function canDeleteLesson(role: UserRole) {
  return role === "admin";
}
