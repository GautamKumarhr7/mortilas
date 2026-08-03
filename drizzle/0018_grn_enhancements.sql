ALTER TABLE "grns" ADD COLUMN "vendor_id" uuid;
ALTER TABLE "grns" ADD COLUMN "bid_id" integer;
ALTER TABLE "grns" ADD COLUMN "average_bid_price" numeric(14, 2) DEFAULT '0' NOT NULL;
ALTER TABLE "grns" ADD COLUMN "total_price" numeric(14, 2) DEFAULT '0' NOT NULL;
ALTER TABLE "grn_items" ADD COLUMN "employee_rating" integer DEFAULT 1;

ALTER TABLE "grns" ADD CONSTRAINT "grns_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "grns" ADD CONSTRAINT "grns_bid_id_po_bids_id_fk" FOREIGN KEY ("bid_id") REFERENCES "public"."po_bids"("id") ON DELETE no action ON UPDATE no action;