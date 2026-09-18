// idempotency-keys.ts
import { pgTable, uuid, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

export const idempotencyKeys = pgTable('idempotency_keys', {
  id: uuid().defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  resource: varchar('resource', { length: 50 }).notNull(), // 'transfers' | 'withdrawals'...
  response: jsonb('response'),                             // lưu response trả về
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiredAt: timestamp('expired_at', { withTimezone: true }).notNull(), // key hết hạn sau X giờ
})