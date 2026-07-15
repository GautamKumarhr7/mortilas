ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "role_permissions" DROP COLUMN "module_id";