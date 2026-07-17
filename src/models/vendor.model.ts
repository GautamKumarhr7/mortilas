import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const vendorTypeEnum = pgEnum('vendor_type', ['Material', 'Equipment', 'Service', 'Rental']);
export const vendorStatusEnum = pgEnum('vendor_status', ['Active', 'Inactive', 'Blacklisted']);

export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey(),
  vendorCode: varchar('vendor_code', { length: 255 }).notNull().unique(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  vendorType: vendorTypeEnum('vendor_type').notNull(),
  contactPerson: varchar('contact_person', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  alternatePhone: varchar('alternate_phone', { length: 50 }),
  address: text('address').notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  pincode: varchar('pincode', { length: 20 }).notNull(),
  gstNo: varchar('gst_no', { length: 255 }).notNull(),
  panNo: varchar('pan_no', { length: 255 }).notNull(),
  msmeNo: varchar('msme_no', { length: 255 }),
  electricalLicense: varchar('electrical_license', { length: 255 }),
  epfNo: varchar('epf_no', { length: 255 }),
  esiNo: varchar('esi_no', { length: 255 }),
  bankName: varchar('bank_name', { length: 255 }),
  accountHolder: varchar('account_holder', { length: 255 }),
  accountNumber: varchar('account_number', { length: 255 }),
  ifscCode: varchar('ifsc_code', { length: 50 }),
  paymentTermsId: uuid('payment_terms_id'),
  creditLimit: numeric('credit_limit', { precision: 14, scale: 2 }),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  isPreferred: boolean('is_preferred').notNull().default(false),
  status: vendorStatusEnum('status').notNull().default('Active'),
  remarks: text('remarks'),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
