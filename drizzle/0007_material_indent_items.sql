CREATE TABLE "material_indent_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "indent_id" integer NOT NULL,
  "item_id" integer NOT NULL,
  "work_order_id" integer NOT NULL,
  "required_qty" numeric(14, 2) NOT NULL,
  "available_qty" numeric(14, 2) NOT NULL,
  "shortage_qty" numeric(14, 2) NOT NULL,
  "procurement_required" boolean DEFAULT false NOT NULL,
  "status" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "material_indent_items" ADD CONSTRAINT "material_indent_items_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;