CREATE TABLE "attendance_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendance_id" integer NOT NULL,
	"punch_time" time NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "dob" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "designation_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_log" ADD CONSTRAINT "attendance_log_attendance_id_attendance_id_fk" FOREIGN KEY ("attendance_id") REFERENCES "public"."attendance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "punch_time";--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "punch_type";