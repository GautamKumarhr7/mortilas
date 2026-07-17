CREATE TYPE "work_order_status" AS ENUM ('pending', 'rejected', 'approved');
--> statement-breakpoint
CREATE TABLE "work_orders" (
  "id" serial PRIMARY KEY NOT NULL,
  "project_id" integer NOT NULL,
  "work_order_no" varchar(255) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "subcontractor_id" integer,
  "estimated_cost" numeric(14, 2),
  "start_date" date,
  "end_date" date,
  "progress" integer,
  "status" "work_order_status" DEFAULT 'pending' NOT NULL,
  "approved_by" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_work_order_no_unique" UNIQUE ("work_order_no");
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;