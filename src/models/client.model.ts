import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }).notNull(),
  gstinno: varchar('gstinno', { length: 255 }).notNull(),
  panno: varchar('panno', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
