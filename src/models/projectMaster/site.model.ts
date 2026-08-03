import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { projects } from './project.model.js';
import { users } from '../hr/user.model.js';

export const siteTypeEnum = pgEnum('site_type_enum', [
  'warehouse',
  'construction',
  'factory',
  'office',
]);

export const siteStatusEnum = pgEnum('site_status_enum', [
  'planning',
  'active',
  'completed',
  'on_hold',
  'closed',
]);

export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  siteCode: varchar('site_code', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  type: siteTypeEnum('type').notNull(),
  status: siteStatusEnum('status').notNull().default('planning'),
  siteManagerId: integer('site_manager_id')
    .notNull()
    .references(() => users.id),
  latitude: numeric('latitude', { precision: 10, scale: 8 }),
  longitude: numeric('longitude', { precision: 11, scale: 8 }),
  state: varchar('state', { length: 255 }),
  city: varchar('city', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
