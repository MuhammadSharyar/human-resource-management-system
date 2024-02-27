CREATE TABLE IF NOT EXISTS "leave" (
	"staff_email" varchar(320) PRIMARY KEY NOT NULL,
	"staff_name" varchar(80) NOT NULL,
	"photo" text NOT NULL,
	"department" varchar(70) NOT NULL,
	"reason" varchar(30) NOT NULL,
	"from" date NOT NULL,
	"to" date NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"description" varchar(500),
	"applied_on" date DEFAULT now() NOT NULL,
	CONSTRAINT "leave_staff_email_unique" UNIQUE("staff_email")
);
