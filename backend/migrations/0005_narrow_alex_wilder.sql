ALTER TABLE "device_restrictions" DROP CONSTRAINT "device_restrictions_device_id_unique";--> statement-breakpoint
ALTER TABLE "device_restrictions" ADD COLUMN "account_id" uuid;--> statement-breakpoint
ALTER TABLE "device_restrictions" ADD CONSTRAINT "device_restrictions_account_id_users_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_restrictions" ADD CONSTRAINT "device_restrictions_account_device_unique" UNIQUE("account_id","device_id");