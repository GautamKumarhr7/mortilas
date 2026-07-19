import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum,
  numeric,
  text,
  uuid
} from 'drizzle-orm/pg-core';
import { materialIndents } from './material-indent.model.js';
import { vendors } from '../vendor.model.js';
import { users } from '../hr/user.model.js';
import { projects } from '../projectMaster/project.model.js';

export const purchaseOrderStatusEnum = pgEnum('purchase_order_status', ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Sent to Vendor', 'Accepted by Vendor', 'Partially Delivered', 'Fully Delivered', 'Closed']);

export const purchaseOrders = pgTable('purchase_orders', {
  id: serial('id').primaryKey(),
  poNo: varchar('po_no', { length: 255 }).notNull().unique(),
  indentId: integer('indent_id').references(() => materialIndents.id),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  projectId: integer('project_id').references(() => projects.id),
  totalValue: numeric('total_value', { precision: 14, scale: 2 }).default('0'),
  status: purchaseOrderStatusEnum('status').notNull().default('Draft'),
  deliveryDate: timestamp('delivery_date'),
  transporterDetails: text('transporter_details'),
  createdBy: integer('created_by').references(() => users.id),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
