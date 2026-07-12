import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const module = pgTable('modules', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 255 }).notNull(),
    
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Module = typeof module.$inferSelect;
export type NewModule = typeof module.$inferInsert;
