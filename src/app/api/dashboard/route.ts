import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { count, sum } from "drizzle-orm";
import { departments, leave, salary, staff } from "../../../../db/schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const getCounts = searchParams.get("get-counts");
    if (JSON.parse(getCounts!)) {
      const totalDpts = await db.select({ value: count() }).from(departments);
      const totalStaff = await db.select({ value: count() }).from(staff);
      const totalLeaves = await db.select({ value: count() }).from(leave);
      const totalSalary = await db
        .select({ value: sum(salary.total) })
        .from(salary);

      return Response.json({
        message: "request successful",
        data: {
          dptCount: totalDpts[0].value,
          staffCount: totalStaff[0].value,
          leaveCount: totalLeaves[0].value,
          salaryCount: totalSalary[0].value,
        },
      });
    }
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
