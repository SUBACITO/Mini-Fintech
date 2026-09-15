import { type Database, createDb } from "@Mini-Fintech/db";

import { env } from "./env.server";

const db = createDb(env);

export function getDb(): Database {
  return db;
}
