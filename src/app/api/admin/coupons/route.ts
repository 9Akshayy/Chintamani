import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
  }
  const coupon = {
    id: `coup-${Date.now()}`,
    code,
    description: String(body.description || ""),
    discountType: (body.discountType === "FLAT" ? "FLAT" : "PERCENTAGE") as "FLAT" | "PERCENTAGE",
    discountValue: Number(body.discountValue || 5),
    minOrderValue: Number(body.minOrderValue || 0),
    maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
    usageLimit: Number(body.usageLimit || 100),
    usedCount: 0,
    expiresAt: String(body.expiresAt || "2027-12-31T23:59:59+05:30"),
    isActive: body.isActive !== false,
  };
  db.coupons.unshift(coupon);
  writeStore(db);
  return NextResponse.json({ coupon });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const coupon = db.coupons.find((c) => c.id === body.id);
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
  if (typeof body.isActive === "boolean") coupon.isActive = body.isActive;
  writeStore(db);
  return NextResponse.json({ coupon });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const db = readStore();
  db.coupons = db.coupons.filter((c) => c.id !== id);
  writeStore(db);
  return NextResponse.json({ success: true });
}
