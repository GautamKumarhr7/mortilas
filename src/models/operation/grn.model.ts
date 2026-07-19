import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchase-order.model.js';
import { users } from '../hr/user.model.js';

export const grnStatusEnum = pgEnum('grn_status', ['Draft', 'Pending Quality Check', 'Accepted', 'Rejected', 'Partially Accepted']);

export const grns = pgTable('grns', {
  id: serial('id').primaryKey(),
  grnNo: varchar('grn_no', { length: 255 }).notNull().unique(),
  poId: integer('po_id')
    .notNull()
    .references(() => purchaseOrders.id),
  receivedDate: timestamp('received_date').notNull(),
  storeManagerId: integer('store_manager_id')
    .references(() => users.id),
  status: grnStatusEnum('status').notNull().default('Draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type GRN = typeof grns.$inferSelect;
export type NewGRN = typeof grns.$inferInsert;
