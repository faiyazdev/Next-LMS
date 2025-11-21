import { db } from "@/drizzle";
import { CourseSectionStatus, CourseSectionTable } from "@/drizzle/schema";
import { revalidateCourseSectionCacheTag } from "./cache/courseSections";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { sectionSchema } from "../schemas/courseSections";

export const getNextCourseSectionOrder = async (courseId: string) => {
  const section = await db.query.CourseSectionTable.findFirst({
    where: eq(CourseSectionTable.courseId, courseId),
    orderBy: desc(CourseSectionTable.order),
  });
  return section?.order ? section.order + 1 : 0;
};

export const createSection = async ({
  name,
  status,
  courseId,
  order,
}: {
  order: number;
  name: string;
  status: CourseSectionStatus;
  courseId: string;
}): Promise<CourseSectionTable> => {
  const [newSection] = await db
    .insert(CourseSectionTable)
    .values({ name, status, courseId, order })
    .returning();

  revalidateCourseSectionCacheTag({
    courseId,
    courseSectionId: newSection.id,
  });
  if (newSection == null)
    throw new Error("Failed to create Section, database error");
  return newSection;
};

export const updateSection = async ({
  data,
  sectionId,
}: {
  data: z.infer<typeof sectionSchema>;
  sectionId: string;
}) => {
  const [section] = await db
    .update(CourseSectionTable)
    .set(data)
    .where(eq(CourseSectionTable.id, sectionId))
    .returning();

  revalidateCourseSectionCacheTag({
    courseId: section.courseId,
    courseSectionId: section.id,
  });
  if (section == null)
    throw new Error("Failed to update Section, database error");
  return section;
};

export const deleteSection = async (sectionId: string) => {
  const [section] = await db
    .delete(CourseSectionTable)
    .where(eq(CourseSectionTable.id, sectionId))
    .returning();

  revalidateCourseSectionCacheTag({
    courseId: section.courseId,
    courseSectionId: section.id,
  });
  if (section == null)
    throw new Error("Failed to update Section, database error");
  return section;
};
