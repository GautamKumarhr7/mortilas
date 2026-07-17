CREATE TYPE "inventory_status" AS ENUM ('in stock', 'stortage', 'out of stock');
--> statement-breakpoint
CREATE TABLE "inventories" (
  "id" serial PRIMARY KEY NOT NULL,
  "item_name" varchar(255) NOT NULL,
  "category" varchar(255) NOT NULL,
  "warehouse_location" varchar(255) NOT NULL,
  "hsn" varchar(255) NOT NULL,
  "quantity" numeric(14, 2) NOT NULL,
  "unit" varchar(50) NOT NULL,
  "price" numeric(14, 2) NOT NULL,
  "status" "inventory_status" DEFAULT 'in stock' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);