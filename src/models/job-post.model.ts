import { pgTable, serial, integer, varchar, timestamp, text, date } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';
import { module } from './module.model.js';
import { roles } from './role.model.js';

export const jobPosts = pgTable('job_posts', {
  id: serial('id').primaryKey(),
  postedBy: integer('posted_by').references(() => users.id).notNull(), // employee or admin

  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  departmentId: integer('department_id').references(() => module.id),
  designationId: integer('designation_id').references(() => roles.id),
  employmentType: varchar('employment_type', { length: 50 }), // permanent, contract, trainee
  vacancies: integer('vacancies').default(1).notNull(),
  lastDate: date('last_date'),

  status: varchar('status', { length: 50 }).default('active').notNull(), // draft, active, closed

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type JobPost = typeof jobPosts.$inferSelect;
export type NewJobPost = typeof jobPosts.$inferInsert;
