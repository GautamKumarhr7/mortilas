import {
  pgTable,
  serial,
  uuid,
  integer,
  numeric,
  date,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { subcontractors } from './subcontractor.model.js';

export const subcontractorRateContracts = pgTable('subcontractor_rate_contracts', {
  id: serial('id').primaryKey(),
  subcontractorId: uuid('subcontractor_id')
    .notNull()
    .references(() => subcontractors.id),
  boqItemId: integer('boq_item_id').notNull(),
  agreedRate: numeric('agreed_rate', { precision: 14, scale: 2 }).notNull(),
  validFrom: date('valid_from').notNull(),
  validTo: date('valid_to'),
  revisionNo: integer('revision_no').notNull().default(1),
  status: varchar('status', { length: 255 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SubcontractorRateContract = typeof subcontractorRateContracts.$inferSelect;
export type NewSubcontractorRateContract = typeof subcontractorRateContracts.$inferInsert;
