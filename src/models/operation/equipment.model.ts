import { pgTable, serial, varchar, timestamp, decimal, jsonb, boolean, text, date, uuid, integer } from 'drizzle-orm/pg-core';
import { projects } from '../projectMaster/project.model.js';
import { vendors } from '../vendor.model.js';

export const equipments = pgTable('equipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 50 }).notNull(), // 'Heavy Machinery', 'Vehicles', 'Power Tools', 'Testing Equipment', 'Safety Equipment'
  name: varchar('name', { length: 255 }).notNull(),
  make: varchar('make', { length: 100 }),
  model: varchar('model', { length: 100 }),
  capacity: varchar('capacity', { length: 100 }),
  serialNumber: varchar('serial_number', { length: 100 }).unique(),
  type: varchar('type', { length: 20 }).notNull().default('owned'), // 'owned', 'hired'
  purchaseDate: date('purchase_date'),
  cost: decimal('cost', { precision: 12, scale: 2 }),
  depreciationRate: decimal('depreciation_rate', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).notNull().default('available'), // 'available', 'deployed', 'maintenance', 'breakdown', 'retired'
  currentProjectId: integer('current_project_id').references(() => projects.id),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  rentalRate: decimal('rental_rate', { precision: 12, scale: 2 }), // daily/weekly rate
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const equipmentDeployments = pgTable('equipment_deployments', {
  id: uuid('id').primaryKey().defaultRandom(),
  equipmentId: uuid('equipment_id').references(() => equipments.id).notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  dispatchDate: date('dispatch_date').notNull(),
  expectedReturnDate: date('expected_return_date'),
  actualReturnDate: date('actual_return_date'),
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'returned'
  operatorName: varchar('operator_name', { length: 100 }),
  readingOut: decimal('reading_out', { precision: 12, scale: 2 }), // km or hours at dispatch
  readingIn: decimal('reading_in', { precision: 12, scale: 2 }), // km or hours at return
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const equipmentMaintenance = pgTable('equipment_maintenance', {
  id: uuid('id').primaryKey().defaultRandom(),
  equipmentId: uuid('equipment_id').references(() => equipments.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'preventive', 'breakdown'
  maintenanceDate: date('maintenance_date').notNull(),
  reportedIssue: text('reported_issue'),
  actionTaken: text('action_taken'),
  cost: decimal('cost', { precision: 12, scale: 2 }),
  downtimeHours: decimal('downtime_hours', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'), // 'scheduled', 'in_progress', 'completed'
  rootCause: text('root_cause'),
  performedBy: varchar('performed_by', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const equipmentLogs = pgTable('equipment_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  equipmentId: uuid('equipment_id').references(() => equipments.id).notNull(),
  projectId: integer('project_id').references(() => projects.id),
  logDate: date('log_date').notNull(),
  logType: varchar('log_type', { length: 20 }).notNull(), // 'fuel', 'utilization'
  fuelLitres: decimal('fuel_litres', { precision: 10, scale: 2 }),
  fuelRate: decimal('fuel_rate', { precision: 10, scale: 2 }),
  fuelCost: decimal('fuel_cost', { precision: 12, scale: 2 }),
  hoursOperated: decimal('hours_operated', { precision: 10, scale: 2 }),
  kmOperated: decimal('km_operated', { precision: 10, scale: 2 }),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
