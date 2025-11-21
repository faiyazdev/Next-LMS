import { courseSectionStatuses } from "@/drizzle/schema";
import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(5).max(50),
  status: z.enum(courseSectionStatuses),
});
