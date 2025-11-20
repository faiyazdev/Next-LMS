import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, id } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { CourseProductTable } from "./courseProduct";
import { UserCourseAccessTable } from "./userCourseAccess";
import { CourseSectionTable } from "./courseSection";

export const CourseTable = pgTable("courses", {
  id,
  name: text().notNull(),
  description: text().notNull(),
  createdAt,
  updatedAt,
});
export type CourseTable = typeof CourseTable.$inferInsert;
export const CourseRelationships = relations(CourseTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
  userCourseAccesses: many(UserCourseAccessTable),
  sections: many(CourseSectionTable),
}));
