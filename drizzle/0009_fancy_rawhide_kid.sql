CREATE TABLE IF NOT EXISTS "salary" (
	"staff_name" varchar(80) NOT NULL,
	"staff_email" varchar(320) PRIMARY KEY NOT NULL,
	"basic_salary" real,
	"allowance" real,
	"total" real,
	CONSTRAINT "salary_staff_email_unique" UNIQUE("staff_email")
);
