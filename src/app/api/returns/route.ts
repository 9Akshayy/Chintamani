import { NextResponse } from "next/server";
import { getCurrentSession, requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const db = readStore();
  if (session.role === "ADMIN" || session.role === "SUPER_ADMIN") {
    return NextResponse.json({ returns: db.returnRequests });
  }
  return NextResponse.json({
    returns: db.returnRequests.filter((r) => r.userId === session.userId),
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const body = await request.json();
  const db = readStore();
  const order = db.orders.find(
    (o) => o.id === body.orderId && o.userId === session.userId
  );
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const reqItem = {
    id: `ret-${Date.now()}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    userId: session.userId,
    reason: String(body.reason || "Sizing / Exchange"),
    details: String(body.details || ""),
    status: "REQUESTED" as const,
    refundAmount: order.totalAmount,
    createdAt: new Date().toISOString(),
  };

  db.returnRequests.unshift(reqItem);
  writeStore(db);
  return NextResponse.json({ returnRequest: reqItem });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const ret = db.returnRequests.find((r) => r.id === body.id);
  if (!ret) {
    return NextResponse.json({ error: "Return request not found" }, { status: 404 });
  }
  if (body.status) ret.status = body.status;
  writeStore(db);
  return NextResponse.json({ returnRequest: ret });
}
