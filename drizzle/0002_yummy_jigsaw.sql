CREATE TABLE IF NOT EXISTS "staff" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"department" varchar(70) NOT NULL,
	"gender" varchar(6) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"photo" text NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"date_of_joining" timestamp NOT NULL,
	"city" varchar(45) NOT NULL,
	"state" varchar(30) NOT NULL,
	"country" varchar(50) NOT NULL,
	"address" varchar(100) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_department_departments_name_fk" FOREIGN KEY ("department") REFERENCES "departments"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
