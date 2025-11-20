"use server";
import z from "zod";
import { courseSchema } from "../schemas/courses";
import {
  deleteCourse as deleteCourseDB,
  insertCourse,
  updateCourse as updateCourseDB,
} from "../db/courses";
import { canCreateCourses, canDeleteCourses } from "../permissions/courses";
import { getCurrentUser } from "@/services/clerk/clerk";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const role = (await getCurrentUser()).role;
  if (!role) {
    return { error: true, message: "you are not able to create courses" };
  }
  const { success, data } = courseSchema.safeParse(unsafeData);
  if (!success || !canCreateCourses(role)) {
    return { error: true, message: "There was an error creating course" };
  }
  const course = await insertCourse(data);
  // redirect(`/admin/courses/${course?.id}/edit`);
  return { error: false, course, message: "course created successfully" };
}
export async function updateCourse(
  courseId: string,
  unsafeData: z.infer<typeof courseSchema>
) {
  const role = (await getCurrentUser()).role;
  if (!role) {
    return { error: true, message: "you are not able to create courses" };
  }
  const { success, data } = courseSchema.safeParse(unsafeData);
  if (!success || !canCreateCourses(role)) {
    return { error: true, message: "There was an error updating the course" };
  }
  const course = await updateCourseDB(courseId, data);
  // redirect(`/admin/courses/${course?.id}/edit`);
  return { error: false, course, message: "course updated successfully" };
}

export async function deleteCourse(courseId: string) {
  const role = (await getCurrentUser()).role;
  if (!role) {
    return { error: true, message: "you are not able to delete courses" };
  }
  if (!canDeleteCourses(role)) {
    return { error: true, message: "you are not able to delete courses" };
  }
  await deleteCourseDB(courseId);
  return { error: false, message: "course deleted successfully" };
}
