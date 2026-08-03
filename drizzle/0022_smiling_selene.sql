CREATE TYPE "public"."site_status_enum" AS ENUM('planning', 'active', 'completed', 'on_hold', 'closed');--> statement-breakpoint
CREATE TYPE "public"."site_type_enum" AS ENUM('warehouse', 'construction', 'factory', 'office');--> statement-breakpoint
CREATE TYPE "public"."grn_payment_status" AS ENUM('Pending Finance', 'Payment Initiated', 'Paid');--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_code" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"project_id" integer NOT NULL,
	"type" "site_type_enum" NOT NULL,
	"status" "site_status_enum" DEFAULT 'planning' NOT NULL,
	"site_manager_id" integer NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"state" varchar(255),
	"city" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sites_site_code_unique" UNIQUE("site_code")
);
--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "vendor_id" uuid;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "bid_id" integer;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "average_bid_price" numeric(14, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "total_price" numeric(14, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "payment_status" "grn_payment_status" DEFAULT 'Pending Finance' NOT NULL;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "payment_initiated_at" timestamp;--> statement-breakpoint
ALTER TABLE "grns" ADD COLUMN "payment_initiated_by" integer;--> statement-breakpoint
ALTER TABLE "grn_items" ADD COLUMN "average_price" numeric(14, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "grn_items" ADD COLUMN "employee_rating" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "po_bids" ADD COLUMN "material_average_prices" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_site_manager_id_users_id_fk" FOREIGN KEY ("site_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grns" ADD CONSTRAINT "grns_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grns" ADD CONSTRAINT "grns_bid_id_po_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."po_bids"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grns" ADD CONSTRAINT "grns_payment_initiated_by_users_id_fk" FOREIGN KEY ("payment_initiated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;