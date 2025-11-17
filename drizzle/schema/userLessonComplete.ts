import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";
import { LessonTable } from "./lesson";

export const UserLessonCompleteTable = pgTable(
  "user_lesson_complete",
  {
    lessonId: uuid()
      .notNull()
      .references(() => LessonTable.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.lessonId, t.userId] })]
);

export const UserLessonCompleteRelationships = relations(
  UserLessonCompleteTable,
  ({ one }) => ({
    lesson: one(LessonTable, {
      fields: [UserLessonCompleteTable.lessonId],
      references: [LessonTable.id],
    }),
    user: one(UserTable, {
      fields: [UserLessonCompleteTable.userId],
      references: [UserTable.id],
    }),
  })
);
