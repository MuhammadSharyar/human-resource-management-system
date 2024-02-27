import {
  pgTable,
  varchar,
  serial,
  timestamp,
  real,
  integer,
  boolean,
  text,
  date,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 70 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
  name: varchar("name", { length: 80 }).notNull(),
  department: varchar("department", { length: 70 }).notNull(),
  gender: varchar("gender", { length: 6 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  photo: text("photo").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  dateOfJoining: date("date_of_joining").notNull(),
  city: varchar("city", { length: 45 }).notNull(),
  state: varchar("state", { length: 30 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  address: varchar("address", { length: 100 }).notNull(),
  salaryAssigned: boolean("salary_assigned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salary = pgTable("salary", {
  staffEmail: varchar("staff_email", { length: 320 })
    .notNull()
    .unique()
    .primaryKey(),
  department: varchar("department", { length: 70 }).notNull(),
  staffName: varchar("staff_name", { length: 80 }).notNull(),
  basicSalary: real("basic_salary").notNull(),
  allowance: real("allowance").notNull(),
  total: real("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leave = pgTable("leave", {
  staffEmail: varchar("staff_email", { length: 320 })
    .notNull()
    .unique()
    .primaryKey(),
  staffName: varchar("staff_name", { length: 80 }).notNull(),
  photo: text("photo").notNull(),
  department: varchar("department", { length: 70 }).notNull(),
  reason: varchar("reason", { length: 30 }).notNull(),
  from: date("from").notNull(),
  to: date("to").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("pending"),
  description: varchar("description", { length: 500 }),
  appliedOn: date("applied_on").defaultNow().notNull(),
});

// export const admin = pgTable("admin", {
//   id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
//   name: varchar("name", { length: 80 }).notNull(),
//   companyName: varchar("company_name", { length: 80 }).notNull(),
//   email: varchar("email", { length: 320 }).notNull(),
//   password: varchar("password", { length: 16 }).notNull(),
// });

// export const departments = pgTable("departments", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 30 }).notNull(),
// });

// export const staff = pgTable("staff", {
//   id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
//   name: varchar("name", { length: 80 }).notNull(),
//   department: varchar("department", { length: 30 })
//     .references(() => departments.name)
//     .notNull(),
//   gender: varchar("gender", { length: 10 }).notNull(),
//   email: varchar("email", { length: 320 }).notNull(),
//   password: varchar("password", { length: 16 }).notNull(),
//   mobile: varchar("mobile", { length: 20 }).notNull(),
//   photoUrl: varchar("photo_url", { length: 2000 }).notNull(),
//   dateOfBirth: timestamp("date_of_birth").notNull(),
//   dateOfJoining: timestamp("date_of_joining").notNull(),
//   city: varchar("city", { length: 40 }),
//   state: varchar("state", { length: 40 }),
//   country: varchar("country", { length: 60 }),
//   address: varchar("address", { length: 300 }),
// });

// export const salary = pgTable("salary", {
//   department: varchar("department", { length: 30 })
//     .notNull()
//     .references(() => departments.name),
//   staff: varchar("staff", { length: 80 })
//     .references(() => staff.name)
//     .notNull(),
//   basicSalary: real("basic_salary").notNull().default(0.0),
//   allowance: real("allowance").default(0.0),
//   total: real("total").notNull().default(0.0),
// });

// export const leave = pgTable("leave", {
//   id: serial("id").primaryKey(),
//   staff: varchar("staff", { length: 80 })
//     .references(() => staff.name)
//     .notNull(),
//   photoUrl: varchar("photo_url", { length: 2000 })
//     .references(() => staff.photoUrl)
//     .notNull(),
//   reason: varchar("reason", { length: 255 }).notNull(),
//   from: timestamp("from").notNull(),
//   to: timestamp("to").notNull(),
//   status: varchar("status", { length: 9 }).notNull().default("Pending"),
//   approved: boolean("approved").notNull().default(false),
// });
