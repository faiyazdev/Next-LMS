import { lessonStatuses } from "@/drizzle/schema";
import { z } from "zod";

export const lessonSchema = z.object({
  // id: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  status: z.enum(lessonStatuses),
  sectionId: z.string().min(1),
  youtubeVideoId: z.string().min(1, "Required"),
  description: z.string().min(1).nullable().optional(),
});
