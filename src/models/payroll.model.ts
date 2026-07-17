import { pgTable, serial, integer, numeric, timestamp, varchar, date } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const payrolls = pgTable('payrolls', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => users.id).notNull(),

  // Pay period
  payMonth: integer('pay_month').notNull(), // 1–12
  payYear: integer('pay_year').notNull(),
  payDate: date('pay_date'),

  // ── Earnings ─────────────────────────────────────────────────
  basicSalary: numeric('basic_salary').notNull(),         // from employee.basicPay
  hra: numeric('hra').notNull(),                          // 20% of basic
  conveyanceAllowance: numeric('conveyance_allowance').notNull(), // 15% of basic
  specialAllowance: numeric('special_allowance').notNull(), // 60% of basic
  grossSalary: numeric('gross_salary').notNull(),         // basic + hra + conveyance + special

  // ── Employee Deductions ───────────────────────────────────────
  employeePf: numeric('employee_pf').notNull().default('0'),   // 12% of basic (if pfApplicable)
  employeeEsi: numeric('employee_esi').notNull().default('0'),  // 0.75% of gross (if esiApplicable)
  professionalTax: numeric('professional_tax').notNull().default('0'), // deducted in Sep as applicable
  tds: numeric('tds').notNull().default('0'),             // as per tdsApplicable
  advanceLoanRecovery: numeric('advance_loan_recovery').notNull().default('0'), // manual entry
  totalDeductions: numeric('total_deductions').notNull(),  // sum of all deductions

  // ── Net Pay ───────────────────────────────────────────────────
  netSalary: numeric('net_salary').notNull(),             // grossSalary - totalDeductions

  // ── Employer Contributions (cost centre, not on payslip) ──────
  employerPf: numeric('employer_pf').notNull().default('0'),   // 12% of basic
  employerEsi: numeric('employer_esi').notNull().default('0'), // 3.25% of gross
  totalEmployerCost: numeric('total_employer_cost').notNull(), // grossSalary + employerPf + employerEsi

  // ── Metadata ──────────────────────────────────────────────────
  status: varchar('status', { length: 50 }).default('draft').notNull(), // draft, processed, paid
  remarks: varchar('remarks', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Payroll = typeof payrolls.$inferSelect;
export type NewPayroll = typeof payrolls.$inferInsert;
