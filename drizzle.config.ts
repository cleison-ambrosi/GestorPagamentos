
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "mysql8free-gestor-f.aivencloud.com",
    port: 18411,
    user: "avnadmin",
    password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
    database: "defaultdb",
    ssl: { rejectUnauthorized: true }
  },
});
