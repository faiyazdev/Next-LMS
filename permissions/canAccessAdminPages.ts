import { UserRole } from "@/drizzle/schema";

export async function canAccessAdminPages(userRole: UserRole) {
  return userRole == "admin";
}
