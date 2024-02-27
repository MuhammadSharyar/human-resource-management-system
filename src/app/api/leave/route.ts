import { NextRequest } from "next/server";
import { db } from "../../../../db";
import { leave } from "../../../../db/schema";
import { count, eq, ne } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leaveStatus = searchParams.get("status");
    const isCount = searchParams.get("count");
    if (JSON.parse(isCount!)) {
      const total = await db.select({ value: count() }).from(leave);
      return Response.json({ data: total });
    } else if (leaveStatus && leaveStatus === "not-pending") {
      const leaves = await db
        .select()
        .from(leave)
        .where(ne(leave.status, "pending"));
      return Response.json({ message: "request successful", data: leaves });
    } else if (leaveStatus && leaveStatus === "pending") {
      const leaves = await db
        .select()
        .from(leave)
        .where(eq(leave.status, "pending"));
      return Response.json({ message: "request successful", data: leaves });
    }
    const leaves = await db.select().from(leave);
    return Response.json({ message: "request successful", data: leaves });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    if (email && status) {
      await db.update(leave).set({ status }).where(eq(leave.staffEmail, email));
      return Response.json({ message: "request successful" });
    }
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
