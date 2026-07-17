import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }).notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
