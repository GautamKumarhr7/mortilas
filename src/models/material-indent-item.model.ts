import {
  pgTable,
  serial,
  integer,
  numeric,
  boolean,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { workOrders } from "./work-order.model.js";

export const materialIndentItems = pgTable("material_indent_items", {
  id: serial("id").primaryKey(),
  indentId: integer("indent_id").notNull(),
  itemId: integer("item_id").notNull(),
  workOrderId: integer("work_order_id")
    .notNull()
    .references(() => workOrders.id),
  requiredQty: numeric("required_qty", { precision: 14, scale: 2 }).notNull(),
  availableQty: numeric("available_qty", { precision: 14, scale: 2 }).notNull(),
  shortageQty: numeric("shortage_qty", { precision: 14, scale: 2 }).notNull(),
  procurementRequired: boolean("procurement_required").notNull().default(false),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MaterialIndentItem = typeof materialIndentItems.$inferSelect;
export type NewMaterialIndentItem = typeof materialIndentItems.$inferInsert;
