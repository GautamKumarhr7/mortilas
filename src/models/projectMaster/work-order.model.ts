import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  date,
  numeric,
  pgEnum,
  text,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core';
import { projects } from './project.model.js';
import { users } from '../hr/user.model.js';

export const workOrderStatusEnum = pgEnum('work_order_status', ['pending', 'rejected', 'approved']);

export const workOrders = pgTable('work_orders', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  workOrderNo: varchar('work_order_no', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  subcontractorId: uuid('subcontractor_id'),
  estimatedCost: numeric('estimated_cost', { precision: 14, scale: 2 }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  progress: integer('progress'),
  status: workOrderStatusEnum('status').notNull().default('pending'),
  approvedBy: integer('approved_by').references(() => users.id),
  paymentTerms: text('payment_terms'),
  boqItems: jsonb('boq_items').default('[]'),
  materialRequisitions: jsonb('material_requisitions').default('[]'),
  billingMilestones: jsonb('billing_milestones').default('[]'),
  approvals: jsonb('approvals').default('{"siteEngineer": false, "projectManager": false, "departmentHead": false}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WorkOrder = typeof workOrders.$inferSelect;
export type NewWorkOrder = typeof workOrders.$inferInsert;
