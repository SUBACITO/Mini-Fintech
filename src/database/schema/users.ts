import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UserStatus } from '../../common/enums/user-status.enum.js';

export const userStatus = pgEnum('user_status', [
    UserStatus.PENDING,
    UserStatus.ACTIVATED,
    UserStatus.SUSPENDED,
    UserStatus.BANNED,
] as [string, ...string[]]);

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  status: userStatus().notNull().default('pending'),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  activatedAt: timestamp()
});