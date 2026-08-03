import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum,
  numeric,
  uuid,
} from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchase-order.model.js';
import { poBids } from './po-bid.model.js';
import { users } from '../hr/user.model.js';
import { vendors } from '../businessDevelopment/vendor.model.js';

export const grnStatusEnum = pgEnum('grn_status', [
  'Draft',
  'Pending Quality Check',
  'Accepted',
  'Rejected',
  'Partially Accepted',
]);
export const grnPaymentStatusEnum = pgEnum('grn_payment_status', [
  'Pending Finance',
  'Payment Initiated',
  'Paid',
]);

export const grns = pgTable('grns', {
  id: serial('id').primaryKey(),
  grnNo: varchar('grn_no', { length: 255 }).notNull().unique(),
  poId: integer('po_id')
    .notNull()
    .references(() => purchaseOrders.id),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  bidId: integer('bid_id').references(() => poBids.id),
  averageBidPrice: numeric('average_bid_price', { precision: 14, scale: 2 }).notNull().default('0'),
  totalPrice: numeric('total_price', { precision: 14, scale: 2 }).notNull().default('0'),
  receivedDate: timestamp('received_date').notNull(),
  storeManagerId: integer('store_manager_id').references(() => users.id),
  status: grnStatusEnum('status').notNull().default('Draft'),
  paymentStatus: grnPaymentStatusEnum('payment_status').notNull().default('Pending Finance'),
  paymentInitiatedAt: timestamp('payment_initiated_at'),
  paymentInitiatedBy: integer('payment_initiated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type GRN = typeof grns.$inferSelect;
export type NewGRN = typeof grns.$inferInsert;
