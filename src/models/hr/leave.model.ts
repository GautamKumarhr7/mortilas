import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const leaves = pgTable('leaves', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  remainCl: integer('remain_cl').default(12).notNull(), // Casual Leave: 12 days
  remainSl: integer('remain_sl').default(7).notNull(), // Sick Leave: 7 days
  remainEl: integer('remain_el').default(15).notNull(), // Earned Leave: 15 days
  remainLwp: integer('remain_lwp').default(0).notNull(), // Leave Without Pay
  remainMaternity: integer('remain_maternity').default(182).notNull(), // Maternity: 26 weeks = 182 days
  remainPaternity: integer('remain_paternity').default(15).notNull(), // Paternity: 15 days
  remainCompOff: integer('remain_comp_off').default(0).notNull(), // Compensatory Off

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Leave = typeof leaves.$inferSelect;
export type NewLeave = typeof leaves.$inferInsert;
