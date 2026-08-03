import {
  pgTable,
  serial,
  integer,
  timestamp,
  pgEnum,
  numeric,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core';
import { materialIndents } from './material-indent.model.js';
import { vendors } from '../businessDevelopment/vendor.model.js';

export const poBidStatusEnum = pgEnum('po_bid_status', ['Pending', 'Won', 'Lost']);

export const poBids = pgTable('po_bids', {
  id: serial('id').primaryKey(),
  indentId: integer('indent_id')
    .references(() => materialIndents.id)
    .notNull(),
  vendorId: uuid('vendor_id')
    .references(() => vendors.id)
    .notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  materialAveragePrices: jsonb('material_average_prices').notNull().default('[]'),
  status: poBidStatusEnum('status').notNull().default('Pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type POBid = typeof poBids.$inferSelect;
export type NewPOBid = typeof poBids.$inferInsert;
