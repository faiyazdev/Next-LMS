import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/data-cache";
import { updateTag } from "next/cache";

export function getPurchaseGlobalTag() {
  return getGlobalTag("purchases");
}

export function getPurchaseIdTag(purchaseId: string) {
  return getIdTag("purchases", purchaseId);
}

export function getPurchaseUserTag(purchaseId: string) {
  return getCourseTag("purchases", purchaseId);
}

export function revalidatePurchaseCacheTag({
  purchaseId,
  userId,
}: {
  purchaseId: string;
  userId: string;
}) {
  updateTag(getPurchaseGlobalTag());
  updateTag(getPurchaseIdTag(purchaseId));
  updateTag(getPurchaseUserTag(userId));
}
