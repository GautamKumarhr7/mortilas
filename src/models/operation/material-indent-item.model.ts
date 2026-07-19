import {
  pgTable,
  serial,
  integer,
  numeric,
  boolean,
  varchar,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core';
import { workOrders } from '../projectMaster/work-order.model.js';
import { materialIndents } from './material-indent.model.js';

export const materialIndentItemStatusEnum = pgEnum('material_indent_item_status', ['Pending', 'Approved', 'PO Generated', 'Rejected']);

export const materialIndentItems = pgTable('material_indent_items', {
  id: serial('id').primaryKey(),
  indentId: integer('indent_id')
    .notNull()
    .references(() => materialIndents.id),
  itemId: integer('item_id').notNull(),
  workOrderId: integer('work_order_id')
    .notNull()
    .references(() => workOrders.id),
  requiredQty: numeric('required_qty', { precision: 14, scale: 2 }).notNull(),
  availableQty: numeric('available_qty', { precision: 14, scale: 2 }).notNull(),
  shortageQty: numeric('shortage_qty', { precision: 14, scale: 2 }).notNull(),
  procurementRequired: boolean('procurement_required').notNull().default(false),
  status: materialIndentItemStatusEnum('status').notNull().default('Pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type MaterialIndentItem = typeof materialIndentItems.$inferSelect;
export type NewMaterialIndentItem = typeof materialIndentItems.$inferInsert;
