CREATE TYPE "project_category" AS ENUM ('Civil', 'Electrical', 'HVAC', 'Solar', 'Interior', 'Security', 'Composite');
--> statement-breakpoint
CREATE TYPE "project_status" AS ENUM ('Draft', 'Active', 'On Hold', 'Completed', 'Closed');
--> statement-breakpoint
CREATE TABLE "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "project_code" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "client_id" integer NOT NULL,
  "contract_id" varchar(255),
  "category" "project_category" NOT NULL,
  "site_address" text NOT NULL,
  "latitude" numeric(10, 8),
  "longitude" numeric(11, 8),
  "estimated_cost" numeric(14, 2),
  "contract_value" numeric(14, 2),
  "planned_start" date,
  "planned_end" date,
  "actual_start" date,
  "actual_end" date,
  "process" varchar(255),
  "status" "project_status" DEFAULT 'Draft' NOT NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_code_unique" UNIQUE ("project_code");
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;