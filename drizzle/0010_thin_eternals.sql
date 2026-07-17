CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"date" date NOT NULL,
	"punch_time" time NOT NULL,
	"punch_type" varchar(50) NOT NULL,
	"attendance_type" varchar(50),
	"status" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaves" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"remain_cl" integer DEFAULT 12 NOT NULL,
	"remain_sl" integer DEFAULT 7 NOT NULL,
	"remain_el" integer DEFAULT 15 NOT NULL,
	"remain_lwp" integer DEFAULT 0 NOT NULL,
	"remain_maternity" integer DEFAULT 182 NOT NULL,
	"remain_paternity" integer DEFAULT 15 NOT NULL,
	"remain_comp_off" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leaves_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payrolls" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"pay_month" integer NOT NULL,
	"pay_year" integer NOT NULL,
	"pay_date" date,
	"basic_salary" numeric NOT NULL,
	"hra" numeric NOT NULL,
	"conveyance_allowance" numeric NOT NULL,
	"special_allowance" numeric NOT NULL,
	"gross_salary" numeric NOT NULL,
	"employee_pf" numeric DEFAULT '0' NOT NULL,
	"employee_esi" numeric DEFAULT '0' NOT NULL,
	"professional_tax" numeric DEFAULT '0' NOT NULL,
	"tds" numeric DEFAULT '0' NOT NULL,
	"advance_loan_recovery" numeric DEFAULT '0' NOT NULL,
	"total_deductions" numeric NOT NULL,
	"net_salary" numeric NOT NULL,
	"employer_pf" numeric DEFAULT '0' NOT NULL,
	"employer_esi" numeric DEFAULT '0' NOT NULL,
	"total_employer_cost" numeric NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"remarks" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reimbursements" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"bill_attachment" varchar(500),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"manager_id" integer,
	"manager_approved_at" timestamp,
	"manager_remarks" varchar(500),
	"finance_id" integer,
	"finance_approved_at" timestamp,
	"finance_remarks" varchar(500),
	"rejected_by" integer,
	"rejection_reason" varchar(500),
	"paid_at" timestamp,
	"remarks" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"posted_by" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"department_id" integer,
	"designation_id" integer,
	"employment_type" varchar(50),
	"vacancies" integer DEFAULT 1 NOT NULL,
	"last_date" date,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_post_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"resume_url" varchar(500),
	"status" varchar(50) DEFAULT 'applied' NOT NULL,
	"shortlisted_by" integer,
	"shortlisted_at" timestamp,
	"interview_date" timestamp,
	"interview_remarks" text,
	"interviewed_by" integer,
	"selected_by" integer,
	"selected_at" timestamp,
	"rejected_by" integer,
	"rejected_at" timestamp,
	"rejection_reason" varchar(500),
	"onboarded_user_id" integer,
	"joining_date" date,
	"basic_pay" numeric,
	"document_path" varchar(500),
	"remarks" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "type" varchar(50) DEFAULT 'employee' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dob" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "designation_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employee_code" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_joining" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employment_type" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pan" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "addhar" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "uan_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "basic_pay" numeric;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pf_applicable" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "esi_applicable" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tds_applicable" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_finance_id_users_id_fk" FOREIGN KEY ("finance_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_rejected_by_users_id_fk" FOREIGN KEY ("rejected_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posts" ADD CONSTRAINT "job_posts_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posts" ADD CONSTRAINT "job_posts_department_id_modules_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posts" ADD CONSTRAINT "job_posts_designation_id_roles_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_job_post_id_job_posts_id_fk" FOREIGN KEY ("job_post_id") REFERENCES "public"."job_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_shortlisted_by_users_id_fk" FOREIGN KEY ("shortlisted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_interviewed_by_users_id_fk" FOREIGN KEY ("interviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_selected_by_users_id_fk" FOREIGN KEY ("selected_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_rejected_by_users_id_fk" FOREIGN KEY ("rejected_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_onboarded_user_id_users_id_fk" FOREIGN KEY ("onboarded_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_modules_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_designation_id_roles_id_fk" FOREIGN KEY ("designation_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employee_code_unique" UNIQUE("employee_code");