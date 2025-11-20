import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { updateTag } from "next/cache";

export function getUserCourseAccessGlobalTag() {
  return getGlobalTag("userCourseAccess");
}

export function getUserCourseAccessIdTag({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  return getIdTag("userCourseAccess", `user:${userId}-course:${courseId}`);
}

export function revalidateUserCourseAccessCacheTag({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  updateTag(getUserCourseAccessGlobalTag());
  updateTag(getUserCourseAccessIdTag({ userId, courseId }));
}
