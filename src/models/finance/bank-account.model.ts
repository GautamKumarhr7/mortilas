import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  numeric,
  boolean,
  pgEnum
} from 'drizzle-orm/pg-core';
import { users } from '../hr/user.model.js';

export const bankAccountTypeEnum = pgEnum('bank_account_type', [
  'CURRENT',
  'SAVINGS',
  'OVERDRAFT',
  'CASH_CREDIT',
  'FIXED_DEPOSIT'
]);

export const bankAccountStatusEnum = pgEnum('bank_account_status', [
  'ACTIVE',
  'INACTIVE',
  'CLOSED',
  'FROZEN'
]);

export const bankAccounts = pgTable('bank_accounts', {
  id: serial('id').primaryKey(),

  bankName: varchar('bank_name', { length: 255 }).notNull(),
  accountNo: varchar('account_no', { length: 100 }).notNull().unique(),
  ifscCode: varchar('ifsc_code', { length: 20 }).notNull(),
  branch: varchar('branch', { length: 255 }),
  accountHolder: varchar('account_holder', { length: 255 }).notNull(),
  accountType: bankAccountTypeEnum('account_type').notNull().default('CURRENT'),
  status: bankAccountStatusEnum('status').notNull().default('ACTIVE'),

  openingBalance: numeric('opening_balance').notNull().default('0'),
  currentBalance: numeric('current_balance').notNull().default('0'),

  micrCode: varchar('micr_code', { length: 20 }),
  swiftCode: varchar('swift_code', { length: 20 }),
  upiId: varchar('upi_id', { length: 100 }),

  isDefault: boolean('is_default').notNull().default(false),

  createdBy: integer('created_by').references(() => users.id),
  updatedBy: integer('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BankAccount = typeof bankAccounts.$inferSelect;
export type NewBankAccount = typeof bankAccounts.$inferInsert;
