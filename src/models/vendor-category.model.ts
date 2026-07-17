import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const vendorCategories = pgTable("vendor_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type VendorCategory = typeof vendorCategories.$inferSelect;
export type NewVendorCategory = typeof vendorCategories.$inferInsert;
