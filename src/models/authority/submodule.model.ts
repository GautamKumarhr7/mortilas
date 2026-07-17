import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { module } from './module.model.js';

export const submodules = pgTable('submodules', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }).notNull(),
  moduleId: integer('module_id')
    .notNull()
    .references(() => module.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SubModule = typeof submodules.$inferSelect;
export type NewSubModule = typeof submodules.$inferInsert;
