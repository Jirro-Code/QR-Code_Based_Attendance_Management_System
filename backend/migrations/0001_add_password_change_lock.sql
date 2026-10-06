ALTER TABLE "users"
ADD COLUMN "password_change_attempts" integer DEFAULT 0 NOT NULL,
ADD COLUMN "password_change_locked_until" timestamp with time zone;
