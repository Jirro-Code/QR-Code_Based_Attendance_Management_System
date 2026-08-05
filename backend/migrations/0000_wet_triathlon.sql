CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."student_strand" AS ENUM('ICT', 'HRCTO', 'GAS', 'HUMSS', 'ABM', 'STEM', 'AAD');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"attended_at" timestamp DEFAULT now() NOT NULL,
	"is_late" boolean DEFAULT false NOT NULL,
	CONSTRAINT "attendance_user_event_unique" UNIQUE("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"event_description" text,
	"event_location" varchar(255),
	"event_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"student_id" varchar(13),
	"student_LRN" varchar(12),
	"studentStrand" "student_strand" NOT NULL,
	"student_section" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "users_student_LRN_unique" UNIQUE("student_LRN")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;