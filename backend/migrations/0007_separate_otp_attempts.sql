ALTER TYPE "security_action" ADD VALUE IF NOT EXISTS 'otp';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp_locked_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "otp_last_attempt_at" timestamp with time zone;
