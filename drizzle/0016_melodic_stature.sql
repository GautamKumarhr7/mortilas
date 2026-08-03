CREATE TYPE "public"."po_delivery_status" AS ENUM('Not Started', 'Packaging', 'Dispatched', 'Arrived');--> statement-breakpoint
CREATE TYPE "public"."po_bid_status" AS ENUM('Pending', 'Won', 'Lost');--> statement-breakpoint
CREATE TABLE "po_bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"po_id" integer NOT NULL,
	"vendor_id" uuid NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"status" "po_bid_status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "vendor_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "iso_no" varchar(255);--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "delivery_status" "po_delivery_status" DEFAULT 'Not Started' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "dispatch_date" timestamp;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "arrival_time" timestamp;--> statement-breakpoint
ALTER TABLE "po_bids" ADD CONSTRAINT "po_bids_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "po_bids" ADD CONSTRAINT "po_bids_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_category_id_vendor_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."vendor_categories"("id") ON DELETE no action ON UPDATE no action;