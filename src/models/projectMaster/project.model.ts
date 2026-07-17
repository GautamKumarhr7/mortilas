import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  numeric,
  date,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { clients } from '../client.model.js';

export const projectCategoryEnum = pgEnum('project_category', [
  'Civil',
  'Electrical',
  'HVAC',
  'Solar',
  'Interior',
  'Security',
  'Composite',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'Draft',
  'Active',
  'On Hold',
  'Completed',
  'Closed',
]);

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  projectCode: varchar('project_code', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id),
  contractId: varchar('contract_id', { length: 255 }),
  category: projectCategoryEnum('category').notNull(),
  siteAddress: text('site_address').notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 8 }),
  longitude: numeric('longitude', { precision: 11, scale: 8 }),
  estimatedCost: numeric('estimated_cost', { precision: 14, scale: 2 }),
  contractValue: numeric('contract_value', { precision: 14, scale: 2 }),
  plannedStart: date('planned_start'),
  plannedEnd: date('planned_end'),
  actualStart: date('actual_start'),
  actualEnd: date('actual_end'),
  process: varchar('process', { length: 255 }),
  status: projectStatusEnum('status').notNull().default('Draft'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
