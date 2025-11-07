import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMID", "BASIC"]);

export const usersTable = pgTable(
  "users",
  {
    // Primary Key and Auto-Increment
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    // Optional field (allows NULL)
    name: varchar("name", { length: 255 }),

    // Required field, explicitly named "email", and unique
    email: varchar("email", { length: 255 }).notNull().unique(),

    // Optional field, defaults to 'BASIC'
    role: UserRole("role").default("BASIC"),

    // Timestamp fields
    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow().notNull(),

    // Soft delete: Optional, no default, will be NULL by default
    deleted_at: timestamp("deleted_at"),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);
