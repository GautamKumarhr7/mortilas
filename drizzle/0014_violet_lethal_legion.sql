-- CREATE TYPE "public"."material_indent_item_status" AS ENUM('Pending', 'Approved', 'PO Generated', 'Rejected');--> statement-breakpoint
-- CREATE TYPE "public"."material_indent_status" AS ENUM('Pending', 'Approved', 'Rejected', 'PO Created', 'Partially Received', 'Received');--> statement-breakpoint
-- CREATE TYPE "public"."purchase_order_status" AS ENUM('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Sent to Vendor', 'Accepted by Vendor', 'Partially Delivered', 'Fully Delivered', 'Closed');--> statement-breakpoint
-- CREATE TYPE "public"."grn_status" AS ENUM('Draft', 'Pending Quality Check', 'Accepted', 'Rejected', 'Partially Accepted');--> statement-breakpoint
CREATE TABLE "material_indents" (
	"id" serial PRIMARY KEY NOT NULL,
	"indent_no" varchar(255) NOT NULL,
	"work_order_id" integer NOT NULL,
	"requested_by" integer NOT NULL,
	"status" "material_indent_status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "material_indents_indent_no_unique" UNIQUE("indent_no")
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_no" varchar(255) NOT NULL,
	"indent_id" integer,
	"vendor_id" integer,
	"project_id" integer,
	"total_value" numeric(14, 2) DEFAULT '0',
	"status" "purchase_order_status" DEFAULT 'Draft' NOT NULL,
	"delivery_date" timestamp,
	"transporter_details" text,
	"created_by" integer,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchase_orders_po_no_unique" UNIQUE("po_no")
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"approved_make" varchar(255),
	"quantity" numeric(14, 2) NOT NULL,
	"rate" numeric(14, 2) NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grns" (
	"id" serial PRIMARY KEY NOT NULL,
	"grn_no" varchar(255) NOT NULL,
	"po_id" integer NOT NULL,
	"received_date" timestamp NOT NULL,
	"store_manager_id" integer,
	"status" "grn_status" DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "grns_grn_no_unique" UNIQUE("grn_no")
);
--> statement-breakpoint
CREATE TABLE "grn_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"grn_id" integer NOT NULL,
	"po_item_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"received_qty" numeric(14, 2) NOT NULL,
	"accepted_qty" numeric(14, 2) DEFAULT '0',
	"rejected_qty" numeric(14, 2) DEFAULT '0',
	"quality_status" varchar(255) DEFAULT 'Pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"project_id" integer NOT NULL,
	"dispatch_date" date NOT NULL,
	"expected_return_date" date,
	"actual_return_date" date,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"operator_name" varchar(100),
	"reading_out" numeric(12, 2),
	"reading_in" numeric(12, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"project_id" integer,
	"log_date" date NOT NULL,
	"log_type" varchar(20) NOT NULL,
	"fuel_litres" numeric(10, 2),
	"fuel_rate" numeric(10, 2),
	"fuel_cost" numeric(12, 2),
	"hours_operated" numeric(10, 2),
	"km_operated" numeric(10, 2),
	"remarks" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_maintenance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"maintenance_date" date NOT NULL,
	"reported_issue" text,
	"action_taken" text,
	"cost" numeric(12, 2),
	"downtime_hours" numeric(10, 2),
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"root_cause" text,
	"performed_by" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"make" varchar(100),
	"model" varchar(100),
	"capacity" varchar(100),
	"serial_number" varchar(100),
	"type" varchar(20) DEFAULT 'owned' NOT NULL,
	"purchase_date" date,
	"cost" numeric(12, 2),
	"depreciation_rate" numeric(5, 2),
	"status" varchar(20) DEFAULT 'available' NOT NULL,
	"current_project_id" integer,
	"vendor_id" integer,
	"rental_rate" numeric(12, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "equipments_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "subcontractor_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "material_indent_items" ALTER COLUMN "status" SET DEFAULT 'Pending'::"public"."material_indent_item_status";--> statement-breakpoint
ALTER TABLE "material_indent_items" ALTER COLUMN "status" SET DATA TYPE "public"."material_indent_item_status" USING "status"::"public"."material_indent_item_status";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "esi_number" varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "revised_end" date;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "advance_payment" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "retention_percentage" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "payment_terms" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "documents" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "payment_terms" text;--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "boq_items" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "material_requisitions" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "billing_milestones" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "approvals" jsonb DEFAULT '{"siteEngineer": false, "projectManager": false, "departmentHead": false}';--> statement-breakpoint
ALTER TABLE "job_posts" ADD COLUMN "basic_pay" numeric;--> statement-breakpoint
ALTER TABLE "applicants" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "applicants" ADD COLUMN "education" jsonb;--> statement-breakpoint
ALTER TABLE "applicants" ADD COLUMN "experience" jsonb;--> statement-breakpoint
ALTER TABLE "material_indents" ADD CONSTRAINT "material_indents_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_indents" ADD CONSTRAINT "material_indents_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_indent_id_material_indents_id_fk" FOREIGN KEY ("indent_id") REFERENCES "public"."material_indents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_item_id_inventories_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grns" ADD CONSTRAINT "grns_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grns" ADD CONSTRAINT "grns_store_manager_id_users_id_fk" FOREIGN KEY ("store_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_grn_id_grns_id_fk" FOREIGN KEY ("grn_id") REFERENCES "public"."grns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_po_item_id_purchase_order_items_id_fk" FOREIGN KEY ("po_item_id") REFERENCES "public"."purchase_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_item_id_inventories_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_deployments" ADD CONSTRAINT "equipment_deployments_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_deployments" ADD CONSTRAINT "equipment_deployments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_logs" ADD CONSTRAINT "equipment_logs_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_logs" ADD CONSTRAINT "equipment_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_current_project_id_projects_id_fk" FOREIGN KEY ("current_project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "material_indent_items" ADD CONSTRAINT "material_indent_items_indent_id_material_indents_id_fk" FOREIGN KEY ("indent_id") REFERENCES "public"."material_indents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;