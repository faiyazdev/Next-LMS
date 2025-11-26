import { CourseSectionTable, LessonTable } from "@/drizzle/schema";
import { getLessonIdTag, revalidateLessonCacheTag } from "./cache/lessons";
import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { lessonSchema } from "../schemas/lessons";
import z from "zod";
import { cacheTag } from "next/cache";

export const updateLessonOrders = async (lessonIds: string[]) => {
  const [updatedLessons, courseId] = await db.transaction(
    async (
      tx
    ): Promise<
      [{ lessonId: string; sectionId: string }[], courseId: string]
    > => {
      // update lessons in parallel using tx
      const lessons = await Promise.all(
        lessonIds.map((id, idx) =>
          tx
            .update(LessonTable)
            .set({ order: idx })
            .where(eq(LessonTable.id, id))
            .returning({
              sectionId: LessonTable.sectionId,
              lessonId: LessonTable.id,
            })
        )
      );

      // lessons = [ [row], [row], [row], ... ]
      const flattened = lessons.flat(); // now it's a flat array

      const sectionId = flattened[0]?.sectionId;
      if (!sectionId) return tx.rollback();

      const section = await tx.query.CourseSectionTable.findFirst({
        where: eq(CourseSectionTable.id, sectionId),
      });

      if (!section) return tx.rollback();

      return [flattened, section.courseId];
    }
  );

  // revalidate after transaction commits
  updatedLessons.forEach(({ lessonId }) => {
    revalidateLessonCacheTag({ lessonId, courseId });
  });
};

export async function insertLesson(data: z.infer<typeof lessonSchema>) {
  const getNextLessonOrder = await db.query.LessonTable.findFirst({
    columns: { order: true },
    where: eq(LessonTable.sectionId, data.sectionId),
    orderBy: desc(LessonTable.order),
  });

  const nextOrder = (Number(getNextLessonOrder?.order ?? 0) || 0) + 1;

  const [insertedLesson] = await db
    .insert(LessonTable)
    .values({ ...data, order: nextOrder })
    .returning();

  if (!insertedLesson) throw new Error("failed to insert lesson");

  const section = await db.query.CourseSectionTable.findFirst({
    where: eq(CourseSectionTable.id, insertedLesson.sectionId),
  });

  if (!section)
    throw new Error("failed to fetch section, failed to create insert lesson");

  revalidateLessonCacheTag({
    lessonId: insertedLesson.id,
    courseId: section.courseId,
  });
}

export async function updateLesson(
  lessonId: string,
  data: Partial<typeof LessonTable.$inferInsert>
) {
  const [lesson, courseId] = await db.transaction(async (tx) => {
    const currentLesson = await tx.query.LessonTable.findFirst({
      where: eq(LessonTable.id, lessonId),
      columns: {
        sectionId: true,
      },
    });
    if (!currentLesson) return tx.rollback();
    if (
      data.sectionId != null &&
      data.sectionId !== currentLesson?.sectionId &&
      data.order == null
    ) {
      const nextLessonOrder = await tx.query.LessonTable.findFirst({
        where: eq(LessonTable.sectionId, data.sectionId),
        orderBy: desc(LessonTable.order),
        columns: {
          order: true,
        },
      });
      data.order = ((nextLessonOrder?.order ?? 0) || 0) + 1;
    }
    const [updatedLesson] = await tx
      .update(LessonTable)
      .set(data)
      .where(eq(LessonTable.id, lessonId))
      .returning();

    if (!updatedLesson) throw new Error("failed to update lesson");

    const section = await tx.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, updatedLesson.sectionId),
    });

    if (!section)
      throw new Error("failed to fetch section, failed to update lesson");
    return [updatedLesson, section.courseId];
  });
  revalidateLessonCacheTag({
    courseId,
    lessonId: lesson.id,
  });
}

export async function deleteLesson(lessonId: string) {
  const [lesson, courseId] = await db.transaction(async (tx) => {
    const [deletedLesson] = await tx
      .delete(LessonTable)
      .where(eq(LessonTable.id, lessonId))
      .returning();

    if (!deletedLesson) throw new Error("failed to delete lesson");

    const section = await tx.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, deletedLesson.sectionId),
    });

    if (!section)
      throw new Error("failed to fetch section, failed to delete lesson");
    return [deletedLesson, section.courseId];
  });
  revalidateLessonCacheTag({
    courseId,
    lessonId: lesson.id,
  });
}

export async function getLessonById(lessonId: string) {
  "use cache";
  cacheTag(getLessonIdTag(lessonId));
  return await db.query.LessonTable.findFirst({
    where: eq(LessonTable.id, lessonId),
  });
}
