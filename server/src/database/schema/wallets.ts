import {
  bigint,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { WalletStatusEnum } from '../../common/enums/wallet-status.enum.js';
import { users } from './users.js';

export const walletStatusEnum = pgEnum('wallet_status', [
  WalletStatusEnum.ACTIVE,
  WalletStatusEnum.CLOSED,
  WalletStatusEnum.SUSPENDED
]);

export const wallets = pgTable('wallets', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().notNull().references(() => users.id),
    currency: varchar('currency', {length : 3}).notNull().default('VND'),
    balance: bigint('balance', { mode: 'bigint' }).notNull().default(0n),
    status: walletStatusEnum('status').notNull().default(WalletStatusEnum.ACTIVE),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
})