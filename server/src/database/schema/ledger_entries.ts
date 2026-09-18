import {
    bigint,
    pgTable,
    timestamp,
    uuid,
    pgEnum
} from 'drizzle-orm/pg-core';
import { wallets } from './wallets.js';
import { ledger_transactions } from './ledger_transactions.js';
import { LedgerEntriesType } from '../../common/enums/ledger_entries-type.enum.js';


export const entryTypeEnum = pgEnum('entry_type', [
    LedgerEntriesType.CREDIT,
    LedgerEntriesType.DEBIT
]);

export const ledger_entries = pgTable('ledger_entries', {
    id: uuid().defaultRandom().primaryKey(),
    transactionId: uuid('transaction_id').notNull().references(() => ledger_transactions.id),
    walletId: uuid('wallet_id').notNull().references(() => wallets.id),
    amount: bigint('amount', { mode: 'bigint' }).notNull(), // âm hoặc dương
    type: entryTypeEnum('type').notNull(),                  // DEBIT | CREDIT
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});