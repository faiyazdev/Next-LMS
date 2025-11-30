import { productStatusEnum } from "@/drizzle/schema";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imagePath: z.union([
    z.string().url("invalid url"),
    z.string().startsWith("/", "invalid url"),
  ]),
  priceInDollars: z.number().int().nonnegative(),
  status: z.enum(productStatusEnum.enumValues),
  courseIds: z.array(z.string()).min(1, "At least one course is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
