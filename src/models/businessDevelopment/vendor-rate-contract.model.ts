import {
  pgTable,
  serial,
  integer,
  numeric,
  date,
  varchar,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { vendors } from './vendor.model.js';

export const vendorRateContracts = pgTable('vendor_rate_contracts', {
  id: serial('id').primaryKey(),
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => vendors.id),
  itemId: integer('item_id').notNull(),
  agreedRate: numeric('agreed_rate', { precision: 14, scale: 2 }).notNull(),
  validFrom: date('valid_from').notNull(),
  validTo: date('valid_to'),
  gst: numeric('gst', { precision: 14, scale: 2 }),
  status: varchar('status', { length: 255 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type VendorRateContract = typeof vendorRateContracts.$inferSelect;
export type NewVendorRateContract = typeof vendorRateContracts.$inferInsert;
