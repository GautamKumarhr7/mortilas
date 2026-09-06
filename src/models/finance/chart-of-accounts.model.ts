import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  AnyPgColumn
} from 'drizzle-orm/pg-core';
import { users } from '../hr/user.model.js';

export const accountTypeEnum = pgEnum('account_type', [
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE'
]);

export const accountNatureEnum = pgEnum('account_nature', [
  'DEBIT',
  'CREDIT'
]);

export const classificationEnum = pgEnum('account_classification', [
  'CURRENT_ASSET',
  'FIXED_ASSET',
  'BANK_ACCOUNT',
  'CASH_IN_HAND',
  'SUNDRY_DEBTORS',
  'CURRENT_LIABILITY',
  'LONG_TERM_LIABILITY',
  'SUNDRY_CREDITORS',
  'DUTIES_AND_TAXES',
  'CAPITAL_ACCOUNT',
  'RESERVES_AND_SURPLUS',
  'DIRECT_INCOME',
  'INDIRECT_INCOME',
  'SALES_ACCOUNT',
  'DIRECT_EXPENSE',
  'INDIRECT_EXPENSE',
  'PURCHASE_ACCOUNT'
]);

export const chartOfAccounts = pgTable('chart_of_accounts', {
  id: serial('id').primaryKey(),
  accountCode: varchar('account_code', { length: 50 }).notNull().unique(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
  
  parentId: integer('parent_id').references((): AnyPgColumn => chartOfAccounts.id),
  level: integer('level').notNull().default(1),

  accountType: accountTypeEnum('account_type').notNull(),
  classification: classificationEnum('classification'),
  accountNature: accountNatureEnum('account_nature').notNull(),
  
  isGroup: boolean('is_group').notNull().default(false),
  isSystemAccount: boolean('is_system_account').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  deletedAt: timestamp('deleted_at'),

  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ChartOfAccount = typeof chartOfAccounts.$inferSelect;
export type NewChartOfAccount = typeof chartOfAccounts.$inferInsert;
