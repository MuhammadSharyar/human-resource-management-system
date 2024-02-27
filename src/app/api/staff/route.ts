import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { staff } from "../../../../db/schema";
import { and, count, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const department = searchParams.get("department");
    const salaryAssigned = searchParams.get("salary");
    const isCount = searchParams.get("count");
    if (JSON.parse(isCount!)) {
      const total = await db.select({ value: count() }).from(staff);
      return Response.json({ data: total });
    } else if (department !== null && salaryAssigned !== null) {
      const dptStaff = await db
        .select()
        .from(staff)
        .where(
          and(
            eq(staff.department, department),
            eq(staff.salaryAssigned, JSON.parse(salaryAssigned))
          )
        )
        .orderBy(staff.createdAt);
      return Response.json({ message: "request successful", data: dptStaff });
    } else if (department !== null) {
      const dptStaff = await db
        .select()
        .from(staff)
        .where(eq(staff.department, department))
        .orderBy(staff.createdAt);
      return Response.json({ message: "request successful", data: dptStaff });
    } else if (id !== null) {
      const staffDetails = await db
        .select()
        .from(staff)
        .limit(1)
        .where(eq(staff.id, id));
      return Response.json({
        message: "request successful",
        data: staffDetails[0],
      });
    } else {
      const allStaff = await db.select().from(staff).orderBy(staff.createdAt);
      return Response.json({ message: "request successful", data: allStaff });
    }
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

type StaffDataProps = {
  name: string;
  department: string;
  gender: string;
  email: string;
  phone: string;
  photo: string;
  dateOfBirth: string;
  dateOfJoining: string;
  city: string;
  state: string;
  country: string;
  address: string;
};

export async function POST(req: NextRequest) {
  try {
    const staffData = await req.json();
    await db.insert(staff).values(staffData);
    return Response.json({ message: "request successful" });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffDetails = (await req.json()) as StaffDataProps;
    console.log(staffDetails);
    const id = searchParams.get("id");
    await db.update(staff).set(staffDetails).where(eq(staff.id, id!));
    return Response.json({ message: "request successful" });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await db.delete(staff).where(eq(staff.id, id!));
    return Response.json({ message: "request successful" });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
