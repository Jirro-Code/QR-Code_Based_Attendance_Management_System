CREATE TYPE "public"."security_action" AS ENUM('login', 'change_password');--> statement-breakpoint
CREATE TYPE "public"."security_result" AS ENUM('success', 'failure', 'blocked');--> statement-breakpoint
CREATE TABLE "device_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(64) NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_ip_address" varchar(255),
	"user_agent" varchar(500),
	CONSTRAINT "device_registrations_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "device_restrictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(64) NOT NULL,
	"reason" varchar(100) NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"escalation_level" integer DEFAULT 0 NOT NULL,
	"restricted_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "device_restrictions_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "security_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"device_id" varchar(64) NOT NULL,
	"ip_address" varchar(255),
	"action" "security_action" NOT NULL,
	"result" "security_result" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "device_restrictions" ADD CONSTRAINT "device_restrictions_device_id_device_registrations_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device_registrations"("device_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_attempts" ADD CONSTRAINT "security_attempts_account_id_users_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_attempts" ADD CONSTRAINT "security_attempts_device_id_device_registrations_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device_registrations"("device_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_restrictions_until_idx" ON "device_restrictions" USING btree ("restricted_until");--> statement-breakpoint
CREATE INDEX "security_attempts_device_created_idx" ON "security_attempts" USING btree ("device_id","created_at");--> statement-breakpoint
CREATE INDEX "security_attempts_account_created_idx" ON "security_attempts" USING btree ("account_id","created_at");