import { env } from "@/env/server";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: {
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
  },
  schema,
});
