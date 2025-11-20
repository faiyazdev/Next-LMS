import { db } from "@/drizzle";
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { cacheTag } from "next/cache";
import { asc, countDistinct, desc, eq } from "drizzle-orm";
import {
  getCourseSectionCourseTag,
  getCourseSectionGlobalTag,
} from "@/features/courseSections/db/cache/courseSections";
import {
  getLessonCourseTag,
  getLessonGlobalTag,
} from "@/features/lessons/db/cache/lessons";
import { getUserCourseAccessGlobalTag } from "./cache/userCourseAccess";
import {
  getCourseGlobalTag,
  getCourseIdTag,
  revalidateCourseCacheTag,
} from "./cache/cache";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [createdCourse] = await db.insert(CourseTable).values(data).returning();
  revalidateCourseCacheTag(createdCourse.id);
  return createdCourse;
}

export async function updateCourse(
  courseId: string,
  data: typeof CourseTable.$inferInsert
) {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set({
      name: data.name,
      description: data.description,
    })
    .where(eq(CourseTable.id, courseId))
    .returning();
  revalidateCourseCacheTag(updatedCourse.id);
  return updatedCourse;
}

export async function deleteCourse(courseId: string) {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, courseId))
    .returning();
  revalidateCourseCacheTag(deletedCourse.id);
  return deletedCourse;
}
export async function getCourseById(courseId: string) {
  "use cache";
  cacheTag(
    getCourseIdTag(courseId),
    getLessonCourseTag(courseId),
    getCourseSectionCourseTag(courseId)
  );
  const course = await db.query.CourseTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
    },
    with: {
      sections: {
        orderBy: asc(CourseSectionTable.order),
        columns: {
          order: true,
          id: true,
          name: true,
          status: true,
        },
        with: {
          lessons: {
            orderBy: asc(LessonTable.order),
            columns: {
              order: true,
              id: true,
              name: true,
              status: true,
              youtubeVideoId: true,
              description: true,
              sectionId: true,
            },
          },
        },
      },
    },
    where: eq(CourseTable.id, courseId),
  });
  return course;
}

export async function getAllCourses() {
  "use cache";
  cacheTag(
    getCourseGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag(),
    getUserCourseAccessGlobalTag()
  );

  const courses = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionCount: countDistinct(CourseSectionTable.id),
      lessonCount: countDistinct(LessonTable.id),
      studentCount: countDistinct(UserCourseAccessTable.userId),
    })
    .from(CourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, CourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, CourseTable.id)
    )
    .groupBy(
      CourseTable.id,
      CourseTable.name,
      CourseTable.description,
      CourseTable.createdAt
    )
    .orderBy(desc(CourseTable.createdAt));

  return courses;
}
