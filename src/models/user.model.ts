import { pgTable, serial, varchar, timestamp, integer, boolean, numeric, date } from 'drizzle-orm/pg-core';
import { module } from './module.model.js';
import { roles } from './role.model.js';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  // Common fields
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).default('employee').notNull(), // admin, employee, applicant

  // Employee-specific fields (nullable for non-employee types)
  dob: date('dob'),
  departmentId: integer('department_id').references(() => module.id),
  designationId: integer('designation_id').references(() => roles.id),
  employeeCode: varchar('employee_code', { length: 50 }).unique(),
  dateOfJoining: date('date_of_joining'),
  employmentType: varchar('employment_type', { length: 50 }), // permanent, contract, trainee
  pan: varchar('pan', { length: 50 }),
  addhar: varchar('addhar', { length: 50 }),
  uanNumber: varchar('uan_number', { length: 50 }),
  basicPay: numeric('basic_pay'),
  pfApplicable: boolean('pf_applicable').default(false),
  esiApplicable: boolean('esi_applicable').default(false),
  tdsApplicable: integer('tds_applicable').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Aliases for backward compatibility with employee-specific code
export type Employee = User;
export type NewEmployee = NewUser;
export { users as employees };
