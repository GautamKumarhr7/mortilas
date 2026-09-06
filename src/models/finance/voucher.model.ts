import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';

export const vouchers = pgTable('vouchers', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  buyer: varchar('buyer', { length: 255 }),
  seller: varchar('seller', { length: 255 }),
  
  itemsdetails: jsonb('itemsdetails'), 
  gstrate: numeric('gstrate').default('0'),
  tdsrate: numeric('tdsrate').default('0'),
  
  invoiceId: varchar('invoice_id', { length: 255 }),
  narration: varchar('narration', { length: 1000 }),
  entrydate: timestamp('entrydate').notNull().defaultNow(),
  
  // array of { id: number/string, amount: number } referencing bank accounts
  accountIds: jsonb('account_ids'), 

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Voucher = typeof vouchers.$inferSelect;
export type NewVoucher = typeof vouchers.$inferInsert;
