
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

const connection = mysql.createPool({
  host: "mysql8free-gestor-f.aivencloud.com",
  port: 18411,
  user: "avnadmin",
  password: "AVNS_mv1K1_d_Hr_ZbRKQWMs",
  database: "pagamentos",
  ssl: { rejectUnauthorized: true },
  connectionLimit: 10
});

export const db = drizzle(connection, { schema, mode: 'default' });
