import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

export const inventoryStatusEnum = pgEnum("inventory_status", [
  "in stock",
  "stortage",
  "out of stock",
]);

export const inventories = pgTable("inventories", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  warehouseLocation: varchar("warehouse_location", { length: 255 }).notNull(),
  hsn: varchar("hsn", { length: 255 }).notNull(),
  quantity: numeric("quantity", { precision: 14, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  status: inventoryStatusEnum("status").notNull().default("in stock"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Inventory = typeof inventories.$inferSelect;
export type NewInventory = typeof inventories.$inferInsert;
