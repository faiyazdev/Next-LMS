import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, id } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { CourseSectionTable } from "./courseSection";
import { UserLessonCompleteTable } from "./userLessonComplete";

export const lessonStatuses = ["public", "private", "preview"] as const;
export type LessonStatus = (typeof lessonStatuses)[number];
export const LessonStatusEnum = pgEnum("lesson_status", lessonStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text().notNull(),
  description: text(),
  youtubeVideoId: text().notNull(),
  order: integer().notNull(),
  status: LessonStatusEnum().default("private").notNull(),
  sectionId: uuid()
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});
export type LessonTable = typeof LessonTable.$inferInsert;
export const LessonRelationships = relations(LessonTable, ({ one, many }) => ({
  section: one(CourseSectionTable, {
    fields: [LessonTable.sectionId],
    references: [CourseSectionTable.id],
  }),
  userLessonComplete: many(UserLessonCompleteTable),
}));
