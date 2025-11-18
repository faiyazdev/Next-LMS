import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, deletedAt, id } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { UserCourseAccessTable } from "./userCourseAccess";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const UserRoleEnum = pgEnum("user_role", userRoles);

export const UserTable = pgTable("users", {
  id,
  clerkUserId: text("clerk_user_id").notNull().unique(),

  name: varchar("name", { length: 255 }),

  email: varchar("email", { length: 255 }).notNull(),

  imageUrl: text("image_url"),

  role: UserRoleEnum("role").notNull().default("user"),

  createdAt,
  updatedAt,
  deletedAt,
});

export type UserTable = typeof UserTable.$inferInsert;
export const UserRelationships = relations(UserTable, ({ many }) => ({
  userCourseAccesses: many(UserCourseAccessTable),
}));
