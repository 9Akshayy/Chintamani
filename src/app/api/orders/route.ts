import { NextResponse } from "next/server";
import { getCurrentSession, requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const session = await getCurrentSession();
  const db = readStore();

  if (orderNumber) {
    const order = db.orders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (session.role === "ADMIN" || session.role === "SUPER_ADMIN") {
    return NextResponse.json({ orders: db.orders });
  }

  const customerOrders = db.orders.filter((o) => o.userId === session.userId);
  return NextResponse.json({ orders: customerOrders });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const orderId = String(body.orderId || "");
  const db = readStore();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (body.status) order.status = body.status;
  if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
  if (typeof body.awbNumber === "string") order.awbNumber = body.awbNumber;
  if (typeof body.courierName === "string") order.courierName = body.courierName;
  if (typeof body.trackingUrl === "string") order.trackingUrl = body.trackingUrl;
  if (typeof body.invoiceNumber === "string")
    order.invoiceNumber = body.invoiceNumber;
  order.updatedAt = new Date().toISOString();

  writeStore(db);
  return NextResponse.json({ order });
}
