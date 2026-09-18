import {
    bigint,
    pgTable,
    timestamp,
    uuid,
    pgEnum
} from 'drizzle-orm/pg-core';
import { wallets } from './wallets.js';
import { TransferStatus } from '../../common/enums/transfer-status.enum.js';

export const transferStatusEnum = pgEnum('transfer_status', [
    TransferStatus.PENDING,
    TransferStatus.FAILED,
    TransferStatus.COMPLETED,
    TransferStatus.CANCELLED
]);

export const transfers = pgTable('transfers', {
    id: uuid().defaultRandom().primaryKey(),
    sender_wallet_id: uuid().notNull().references(() => wallets.id),
    receiver_wallet_id: uuid().notNull().references(() => wallets.id),
    amount: bigint('amount', { mode: 'bigint' }).notNull().default(0n),
    status: transferStatusEnum('status').notNull().default(TransferStatus.PENDING),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }),
})