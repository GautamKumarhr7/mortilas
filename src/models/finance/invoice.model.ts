import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  numeric,
  jsonb,
  uuid
} from 'drizzle-orm/pg-core';
import { projects } from '../projectMaster/project.model.js';
import { vendors } from '../businessDevelopment/vendor.model.js';

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceId: varchar('invoice_id', { length: 255 }).notNull().unique(),
  buyerName: varchar('buyer_name', { length: 255 }).notNull(),
  sellerName: varchar('seller_name', { length: 255 }).notNull(),
  issueDate: timestamp('issue_date').notNull(),
  
  items: jsonb('items'), // [{ quantity: number, rate: number, description: string }]
  
  totalAmount: numeric('total_amount').notNull().default('0'),
  gst: numeric('gst').notNull().default('0'),
  retention: numeric('retention').notNull().default('0'),

  projectId: integer('project_id').references(() => projects.id),
  vendorId: uuid('vendor_id').references(() => vendors.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
