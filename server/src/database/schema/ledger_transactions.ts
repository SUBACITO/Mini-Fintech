import {
    varchar,
    pgTable,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { transfers } from './transfers.js';

export const ledger_transactions = pgTable('ledger_transactions', {
    id: uuid().defaultRandom().primaryKey(),
    transfer_id: uuid().notNull().references(() => transfers.id),
    description: varchar('description', { length: 500 }).default('Test'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})