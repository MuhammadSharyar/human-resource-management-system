import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { salary, staff } from "../../../../db/schema";
import { count, eq } from "drizzle-orm";

type SalaryDataType = {
  id: string;
  department: string;
  email: string;
  name: string;
  basicSalary: number;
  allowance: number;
  total: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  if (department !== null) {
    const dptSalaries = await db
      .select()
      .from(salary)
      .where(eq(salary.department, department))
      .orderBy(salary.createdAt);
    return Response.json({ message: "request successful", data: dptSalaries });
  } else {
    const allSalaries = await db
      .select()
      .from(salary)
      .orderBy(salary.createdAt);
    return Response.json({ message: "request successful", data: allSalaries });
  }
}

export async function POST(req: NextRequest) {
  try {
    const salaryData = (await req.json()) as SalaryDataType;
    await db.insert(salary).values({
      staffName: salaryData.name,
      staffEmail: salaryData.email,
      department: salaryData.department,
      basicSalary: salaryData.basicSalary,
      allowance: salaryData.allowance,
      total: salaryData.total,
    });
    await db
      .update(staff)
      .set({ salaryAssigned: true })
      .where(eq(staff.id, salaryData.id));
    return Response.json({ message: "request successful" });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const salaryData = await req.json();
    await db
      .update(salary)
      .set({
        basicSalary: salaryData.basicSalary,
        allowance: salaryData.allowance,
        total: salaryData.total,
      })
      .where(eq(salary.staffEmail, salaryData.staffEmail));
    return Response.json({ message: "request successful" });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const isCount = searchParams.get("count");
    if (JSON.parse(isCount!)) {
      const total = await db.select({ value: count() }).from(salary);
      return Response.json({ data: total });
    } else if (email !== null) {
      await db.delete(salary).where(eq(salary.staffEmail, email));
      await db
        .update(staff)
        .set({ salaryAssigned: false })
        .where(eq(staff.email, email));
      return Response.json({ message: "request successful" });
    }
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
