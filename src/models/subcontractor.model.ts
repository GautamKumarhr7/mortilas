import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  numeric,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const subcontractorTradeEnum = pgEnum("subcontractor_trade", [
  "Civil",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Painting",
  "Fabrication",
]);
export const subcontractorStatusEnum = pgEnum("subcontractor_status", [
  "Active",
  "Inactive",
  "Blacklisted",
]);
export const subcontractorTdsTypeEnum = pgEnum("subcontractor_tds_type", [
  "Individual",
  "Company",
]);

export const subcontractors = pgTable("subcontractors", {
  id: uuid("id").primaryKey(),
  subcontractorCode: varchar("subcontractor_code", { length: 255 })
    .notNull()
    .unique(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  trade: subcontractorTradeEnum("trade").notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  alternatePhone: varchar("alternate_phone", { length: 50 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  pincode: varchar("pincode", { length: 20 }).notNull(),
  gstNo: varchar("gst_no", { length: 255 }).notNull(),
  panNo: varchar("pan_no", { length: 255 }).notNull(),
  aadhaarNo: varchar("aadhaar_no", { length: 255 }),
  labourLicenseNo: varchar("labour_license_no", { length: 255 }),
  electricalLicenseNo: varchar("electrical_license_no", { length: 255 }),
  epfNo: varchar("epf_no", { length: 255 }),
  esiNo: varchar("esi_no", { length: 255 }),
  bankName: varchar("bank_name", { length: 255 }),
  accountHolder: varchar("account_holder", { length: 255 }),
  accountNumber: varchar("account_number", { length: 255 }),
  ifscCode: varchar("ifsc_code", { length: 50 }),
  tdsType: subcontractorTdsTypeEnum("tds_type").notNull(),
  tdsRate: numeric("tds_rate", { precision: 14, scale: 2 }),
  defaultRetentionPercent: numeric("default_retention_percent", {
    precision: 14,
    scale: 2,
  }),
  performanceRating: numeric("performance_rating", { precision: 2, scale: 1 }),
  blacklistReason: text("blacklist_reason"),
  status: subcontractorStatusEnum("status").notNull().default("Active"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Subcontractor = typeof subcontractors.$inferSelect;
export type NewSubcontractor = typeof subcontractors.$inferInsert;
