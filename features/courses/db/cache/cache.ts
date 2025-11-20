import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { updateTag } from "next/cache";

export function getCourseGlobalTag() {
  return getGlobalTag("courses");
}

export function getCourseIdTag(id: string) {
  return getIdTag("courses", id);
}

export function revalidateCourseCacheTag(id: string) {
  updateTag(getCourseGlobalTag());
  updateTag(getCourseIdTag(id));
}
