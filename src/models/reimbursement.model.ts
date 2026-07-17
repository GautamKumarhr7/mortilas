import { pgTable, serial, integer, varchar, numeric, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const reimbursements = pgTable('reimbursements', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => users.id).notNull(),

  // Claim details
  type: varchar('type', { length: 100 }).notNull(),
  // travel, medical, mobile_internet, fuel_vehicle, stationery, client_entertainment
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  amount: numeric('amount').notNull(),
  billAttachment: varchar('bill_attachment', { length: 500 }), // file path / URL / OCR ref

  // Multi-level approval: Employee → Manager → Finance/HR
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  // pending, manager_approved, finance_approved, rejected, paid

  managerId: integer('manager_id').references(() => users.id),
  managerApprovedAt: timestamp('manager_approved_at'),
  managerRemarks: varchar('manager_remarks', { length: 500 }),

  financeId: integer('finance_id').references(() => users.id),
  financeApprovedAt: timestamp('finance_approved_at'),
  financeRemarks: varchar('finance_remarks', { length: 500 }),

  rejectedBy: integer('rejected_by').references(() => users.id),
  rejectionReason: varchar('rejection_reason', { length: 500 }),

  paidAt: timestamp('paid_at'),
  remarks: varchar('remarks', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Reimbursement = typeof reimbursements.$inferSelect;
export type NewReimbursement = typeof reimbursements.$inferInsert;
