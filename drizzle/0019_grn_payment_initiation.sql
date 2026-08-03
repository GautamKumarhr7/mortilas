ALTER TABLE "grns" ADD COLUMN "payment_status" varchar(255) NOT NULL DEFAULT 'Pending Finance';
ALTER TABLE "grns" ADD COLUMN "payment_initiated_at" timestamp;
ALTER TABLE "grns" ADD COLUMN "payment_initiated_by" integer;

ALTER TABLE "grns" ADD CONSTRAINT "grns_payment_initiated_by_users_id_fk" FOREIGN KEY ("payment_initiated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;