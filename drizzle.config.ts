import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    ssl: false,
  },
  strict: true,
  verbose: true,
});
