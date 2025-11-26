"use server";
import {
  insertLesson,
  updateLesson as updatedLessonDb,
  deleteLesson as deleteLessonDb,
  updateLessonOrders as updateLessonOrdersDb,
} from "@/features/lessons/db/lessons";
import z from "zod";
import { lessonSchema } from "../schemas/lessons";
import {
  canCreateLesson,
  canDeleteLesson,
  canUpdateLesson,
} from "../permissions/lessons";
import { getCurrentUser } from "@/services/clerk/clerk";

export const createLesson = async (
  unsafeData: z.infer<typeof lessonSchema>
) => {
  const { success, data } = lessonSchema.safeParse(unsafeData);
  const user = await getCurrentUser();
  if (!success || !user.role || !canCreateLesson(user.role))
    return {
      error: true,
      message: "Lesson failed to create or have no access, error",
    };
  try {
    await insertLesson(data);
  } catch (err) {
    console.log(err);
    return {
      error: true,
      message: "database error, failed to create lesson",
    };
  }
  return {
    error: false,
    message: "Lesson created successfully",
  };
};

export const updateLesson = async (
  lessonId: string,
  unsafeData: z.infer<typeof lessonSchema>
) => {
  const { success, data } = lessonSchema.safeParse(unsafeData);
  const user = await getCurrentUser();
  if (!success || !user.role || !canUpdateLesson(user.role))
    return {
      error: true,
      message: "Lesson failed to update or have no access, error",
    };
  try {
    await updatedLessonDb(lessonId, data);
  } catch {
    return {
      error: true,
      message: "database error, failed to update lesson",
    };
  }
  return {
    error: false,
    message: "Lesson updated successfully",
  };
};
export const deleteLesson = async (lessonId: string) => {
  const user = await getCurrentUser();
  if (!user.role || !canDeleteLesson(user.role))
    return {
      error: true,
      message: "Lesson failed to delete or have no access, error",
    };

  try {
    await deleteLessonDb(lessonId);
  } catch {
    return {
      error: true,
      message: "database error, failed to delete lesson",
    };
  }
  return {
    error: false,
    message: "Lesson deleted successfully",
  };
};

export const updateLessonOrders = async (lessonIds: string[]) => {
  const user = await getCurrentUser();
  if (!user.role || !canCreateLesson(user.role))
    return {
      error: true,
      message: "Lesson orders failed to update or have no access, error",
    };
  try {
    await updateLessonOrdersDb(lessonIds);
  } catch {
    return {
      error: true,
      message: "Failed to update lesson order",
    };
  }
  return {
    error: false,
    message: "Lesson order updated successfully",
  };
};
