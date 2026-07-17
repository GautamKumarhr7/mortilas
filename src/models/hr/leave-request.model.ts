import { pgTable, serial, varchar, timestamp, integer, date, text } from 'drizzle-orm/pg-core';
import { employees } from './employee.model.js';
import { users } from './user.model.js';

export const leaveRequests = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .references(() => employees.id)
    .notNull(),
  type: varchar('type', { length: 50 }).notNull(), // CL, SL, EL, LWP, Maternity, Paternity, CompOff
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  fromDate: date('from_date').notNull(),
  toDate: date('to_date').notNull(),
  approvedBy: integer('approved_by').references(() => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof leaveRequests.$inferInsert;
