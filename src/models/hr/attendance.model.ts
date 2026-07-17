import { pgTable, serial, varchar, timestamp, integer, date, time } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .references(() => users.id)
    .notNull(),
  date: date('date').notNull(),
  punchTime: time('punch_time').notNull(),
  punchType: varchar('punch_type', { length: 50 }).notNull(), // in, out
  attendanceType: varchar('attendance_type', { length: 50 }), // biometric, Mannual
  status: varchar('status', { length: 50 }), // late, ontime, overtime

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
