import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchase-order.model.js';
import { inventories } from '../inventory.model.js';

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: serial('id').primaryKey(),
  poId: integer('po_id')
    .notNull()
    .references(() => purchaseOrders.id),
  itemId: integer('item_id')
    .notNull()
    .references(() => inventories.id),
  approvedMake: varchar('approved_make', { length: 255 }),
  quantity: numeric('quantity', { precision: 14, scale: 2 }).notNull(),
  rate: numeric('rate', { precision: 14, scale: 2 }).notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type NewPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;
