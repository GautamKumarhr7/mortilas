CREATE TYPE "vendor_type" AS ENUM ('Material', 'Equipment', 'Service', 'Rental');
--> statement-breakpoint
CREATE TYPE "vendor_status" AS ENUM ('Active', 'Inactive', 'Blacklisted');
--> statement-breakpoint
CREATE TYPE "subcontractor_trade" AS ENUM ('Civil', 'Electrical', 'Plumbing', 'HVAC', 'Painting', 'Fabrication');
--> statement-breakpoint
CREATE TYPE "subcontractor_status" AS ENUM ('Active', 'Inactive', 'Blacklisted');
--> statement-breakpoint
CREATE TYPE "subcontractor_tds_type" AS ENUM ('Individual', 'Company');
--> statement-breakpoint
CREATE TABLE "vendor_categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendor_categories" ADD CONSTRAINT "vendor_categories_name_unique" UNIQUE ("name");
--> statement-breakpoint
CREATE TABLE "vendors" (
  "id" uuid PRIMARY KEY NOT NULL,
  "vendor_code" varchar(255) NOT NULL,
  "company_name" varchar(255) NOT NULL,
  "vendor_type" "vendor_type" NOT NULL,
  "contact_person" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "alternate_phone" varchar(50),
  "address" text NOT NULL,
  "city" varchar(255) NOT NULL,
  "state" varchar(255) NOT NULL,
  "country" varchar(255) NOT NULL,
  "pincode" varchar(20) NOT NULL,
  "gst_no" varchar(255) NOT NULL,
  "pan_no" varchar(255) NOT NULL,
  "msme_no" varchar(255),
  "electrical_license" varchar(255),
  "epf_no" varchar(255),
  "esi_no" varchar(255),
  "bank_name" varchar(255),
  "account_holder" varchar(255),
  "account_number" varchar(255),
  "ifsc_code" varchar(50),
  "payment_terms_id" uuid,
  "credit_limit" numeric(14, 2),
  "rating" numeric(2, 1),
  "is_preferred" boolean DEFAULT false NOT NULL,
  "status" "vendor_status" DEFAULT 'Active' NOT NULL,
  "remarks" text,
  "created_by" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_vendor_code_unique" UNIQUE ("vendor_code");
--> statement-breakpoint
CREATE TABLE "vendor_rate_contracts" (
  "id" serial PRIMARY KEY NOT NULL,
  "vendor_id" uuid NOT NULL,
  "item_id" integer NOT NULL,
  "agreed_rate" numeric(14, 2) NOT NULL,
  "valid_from" date NOT NULL,
  "valid_to" date,
  "gst" numeric(14, 2),
  "status" varchar(255) DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendor_rate_contracts" ADD CONSTRAINT "vendor_rate_contracts_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint
CREATE TABLE "subcontractors" (
  "id" uuid PRIMARY KEY NOT NULL,
  "subcontractor_code" varchar(255) NOT NULL,
  "company_name" varchar(255) NOT NULL,
  "trade" "subcontractor_trade" NOT NULL,
  "contact_person" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "alternate_phone" varchar(50),
  "address" text NOT NULL,
  "city" varchar(255) NOT NULL,
  "state" varchar(255) NOT NULL,
  "country" varchar(255) NOT NULL,
  "pincode" varchar(20) NOT NULL,
  "gst_no" varchar(255) NOT NULL,
  "pan_no" varchar(255) NOT NULL,
  "aadhaar_no" varchar(255),
  "labour_license_no" varchar(255),
  "electrical_license_no" varchar(255),
  "epf_no" varchar(255),
  "esi_no" varchar(255),
  "bank_name" varchar(255),
  "account_holder" varchar(255),
  "account_number" varchar(255),
  "ifsc_code" varchar(50),
  "tds_type" "subcontractor_tds_type" NOT NULL,
  "tds_rate" numeric(14, 2),
  "default_retention_percent" numeric(14, 2),
  "performance_rating" numeric(2, 1),
  "blacklist_reason" text,
  "status" "subcontractor_status" DEFAULT 'Active' NOT NULL,
  "remarks" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subcontractors" ADD CONSTRAINT "subcontractors_subcontractor_code_unique" UNIQUE ("subcontractor_code");
--> statement-breakpoint
CREATE TABLE "subcontractor_rate_contracts" (
  "id" serial PRIMARY KEY NOT NULL,
  "subcontractor_id" uuid NOT NULL,
  "boq_item_id" integer NOT NULL,
  "agreed_rate" numeric(14, 2) NOT NULL,
  "valid_from" date NOT NULL,
  "valid_to" date,
  "revision_no" integer DEFAULT 1 NOT NULL,
  "status" varchar(255) DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subcontractor_rate_contracts" ADD CONSTRAINT "subcontractor_rate_contracts_subcontractor_id_subcontractors_id_fk" FOREIGN KEY ("subcontractor_id") REFERENCES "public"."subcontractors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;