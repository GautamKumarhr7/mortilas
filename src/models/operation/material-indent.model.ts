import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core';
import { workOrders } from '../projectMaster/work-order.model.js';
import { users } from '../hr/user.model.js';

export const materialIndentStatusEnum = pgEnum('material_indent_status', ['Pending', 'Approved', 'Rejected', 'PO Created', 'Partially Received', 'Received']);

export const materialIndents = pgTable('material_indents', {
  id: serial('id').primaryKey(),
  indentNo: varchar('indent_no', { length: 255 }).notNull().unique(),
  workOrderId: integer('work_order_id')
    .notNull()
    .references(() => workOrders.id),
  requestedBy: integer('requested_by')
    .notNull()
    .references(() => users.id),
  status: materialIndentStatusEnum('status').notNull().default('Pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type MaterialIndent = typeof materialIndents.$inferSelect;
export type NewMaterialIndent = typeof materialIndents.$inferInsert;
