import { UserTable } from "@/drizzle/schema";

export const canCreateSection = (
  user: Partial<typeof UserTable.$inferInsert>
) => {
  return user.role === "admin";
};
export const canDeleteSection = (
  user: Partial<typeof UserTable.$inferInsert>
) => {
  return user.role === "admin";
};
export const canUpdateSection = (
  user: Partial<typeof UserTable.$inferInsert>
) => {
  return user.role === "admin";
};
