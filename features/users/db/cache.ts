import { getGlobalTag, getIdTag } from "@/lib/data-cache";
import { updateTag } from "next/cache";

export function getUserGlobalTag() {
  return getGlobalTag("users");
}

export function getUserIdTag(id: string) {
  return getIdTag("users", id);
}

export function revalidateUserCacheTag(id: string) {
  updateTag(getUserGlobalTag());
  updateTag(getUserIdTag(id));
}
