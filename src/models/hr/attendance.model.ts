import { pgTable, serial, varchar, timestamp, integer, date, time } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .references(() => users.id)
    .notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // in, out
  attendanceType: varchar('attendance_type', { length: 50 }), // biometric, manual

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const attendanceLog = pgTable('attendance_log', {
  id: serial('id').primaryKey(),
  attendanceId: integer('attendance_id')
    .references(() => attendance.id)
    .notNull(),
  punchTime: time('punch_time').notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type AttendanceLog = typeof attendanceLog.$inferSelect;
export type NewAttendanceLog = typeof attendanceLog.$inferInsert;
