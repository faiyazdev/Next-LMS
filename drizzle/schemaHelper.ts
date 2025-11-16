import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom();
export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp().$onUpdate(() => new Date());
export const deletedAt = timestamp();
