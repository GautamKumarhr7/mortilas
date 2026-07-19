import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  numeric
} from 'drizzle-orm/pg-core';
import { grns } from './grn.model.js';
import { purchaseOrderItems } from './purchase-order-item.model.js';
import { inventories } from '../inventory.model.js';

export const grnItems = pgTable('grn_items', {
  id: serial('id').primaryKey(),
  grnId: integer('grn_id')
    .notNull()
    .references(() => grns.id),
  poItemId: integer('po_item_id')
    .notNull()
    .references(() => purchaseOrderItems.id),
  itemId: integer('item_id')
    .notNull()
    .references(() => inventories.id),
  receivedQty: numeric('received_qty', { precision: 14, scale: 2 }).notNull(),
  acceptedQty: numeric('accepted_qty', { precision: 14, scale: 2 }).default('0'),
  rejectedQty: numeric('rejected_qty', { precision: 14, scale: 2 }).default('0'),
  qualityStatus: varchar('quality_status', { length: 255 }).default('Pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type GRNItem = typeof grnItems.$inferSelect;
export type NewGRNItem = typeof grnItems.$inferInsert;
