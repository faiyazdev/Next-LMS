import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, deletedAt, id } from "../schemaHelper";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const UserRoleEnum = pgEnum("user_role", userRoles);

export const UsersTable = pgTable("users", {
  id,
  clerkUserId: text().notNull().unique(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  imageUrl: text(),
  role: UserRoleEnum().notNull().default("user"),
  createdAt,
  updatedAt,
  deletedAt,
});
