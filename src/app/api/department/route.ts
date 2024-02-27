import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { departments } from "../../../../db/schema";
import { count, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const isCount = searchParams.get("count");
    if (JSON.parse(isCount!)) {
      const total = await db.select({ value: count() }).from(departments);
      console.log(total[0]);
      return Response.json({ data: total[0] });
    } else if (id !== null) {
      const department = await db
        .select()
        .from(departments)
        .limit(1)
        .where(eq(departments.id, parseInt(id)));
      return Response.json({ data: department[0] });
    } else {
      const allDepartments = await db
        .select()
        .from(departments)
        .orderBy(departments.id);
      return Response.json({ data: allDepartments });
    }
  } catch (err) {
    return Response.json({ err });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { dptName } = await req.json();
    if (dptName.length > 70 || dptName.length < 3)
      return Response.json({ message: "invalid length" });

    const departmentExist = await db
      .select()
      .from(departments)
      .limit(1)
      .where(eq(departments.name, dptName));

    if (departmentExist.length > 0)
      return Response.json({ message: "already exist" });

    await db.insert(departments).values({ name: dptName });
    return Response.json({ message: "request successful" });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "request failed" });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { name } = await req.json();
    const { searchParams } = new URL(req.url);
    const dptId = searchParams.get("id");
    await db
      .update(departments)
      .set({ name })
      .where(eq(departments.id, parseInt(dptId!)));
    return Response.json({ message: "request successful" });
  } catch (err) {
    return Response.json({ message: "request failed" });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    await db.delete(departments).where(eq(departments.id, parseInt(id!)));
    return Response.json({ message: "request successful" });
  } catch (err) {
    return Response.json({ message: "request failed" });
  }
}
