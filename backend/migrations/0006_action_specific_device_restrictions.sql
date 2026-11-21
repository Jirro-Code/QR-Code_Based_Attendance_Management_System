ALTER TABLE "device_restrictions" DROP CONSTRAINT "device_restrictions_account_device_unique";--> statement-breakpoint
ALTER TABLE "device_restrictions" ADD CONSTRAINT "device_restrictions_account_device_reason_unique" UNIQUE("account_id","device_id","reason");
