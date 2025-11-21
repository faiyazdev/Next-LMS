"use server";
import z from "zod";
import { sectionSchema } from "../schemas/courseSections";
import {
  canCreateSection,
  canDeleteSection,
  canUpdateSection,
} from "../permissons/sections";
import { getCurrentUser } from "@/services/clerk/clerk";
import {
  updateSection as updateSectionDB,
  deleteSection as deleteSectionDB,
  createSection as createSectionDB,
  getNextCourseSectionOrder,
} from "../db/courseSections";

export const createSection = async (
  courseId: string,
  unsafeValue: z.infer<typeof sectionSchema>
) => {
  if (!canCreateSection(await getCurrentUser())) {
    return {
      error: true,
      message: "there was an error creating section, you have no access",
    };
  }
  const { success, data } = sectionSchema.safeParse(unsafeValue);
  if (!success) {
    return {
      error: true,
      message: "there was an error creating section, invalid",
    };
  }
  try {
    const order = await getNextCourseSectionOrder(courseId);
    await createSectionDB({ courseId, ...data, order });
    return {
      error: false,
      message: "section created successfully",
    };
  } catch {
    return {
      error: true,
      message: "there was an error creating section, database error",
    };
  }
};

export const updateSection = async (
  sectionId: string,
  unsafeValue: z.infer<typeof sectionSchema>
) => {
  if (!canUpdateSection(await getCurrentUser())) {
    return {
      error: true,
      message: "there was an error updating section, you have no access",
    };
  }
  const { success, data } = sectionSchema.safeParse(unsafeValue);
  if (!success) {
    return {
      error: true,
      message: "there was an error updating section, invalid",
    };
  }
  try {
    await updateSectionDB({ sectionId, data });
    return {
      error: false,
      message: "section updated successfully",
    };
  } catch {
    return {
      error: true,
      message: "there was an error updating section, database error",
    };
  }
};

export const deleteSection = async (sectionId: string) => {
  if (!canDeleteSection(await getCurrentUser())) {
    return {
      error: true,
      message: "there was an error deleting section, you have no access",
    };
  }
  try {
    await deleteSectionDB(sectionId);
    return { error: false, message: "section deleted successfully" };
  } catch {
    return {
      error: true,
      message: "there was an error deleting section, database error",
    };
  }
};
