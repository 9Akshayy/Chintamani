import { NextResponse } from "next/server";
import { getCurrentSession, hashPassword, verifyPassword } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function PATCH(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const db = readStore();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body.action === "change_password") {
    const ok = await verifyPassword(
      String(body.currentPassword || ""),
      user.passwordHash
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
    if (String(body.newPassword || "").length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }
    user.passwordHash = await hashPassword(String(body.newPassword));
    writeStore(db);
    return NextResponse.json({ success: true, message: "Password updated." });
  }

  if (body.action === "add_address") {
    const addr = {
      id: `addr-${Date.now()}`,
      label: String(body.label || "Home"),
      fullName: String(body.fullName || user.name),
      phone: String(body.phone || user.phone),
      line1: String(body.line1 || ""),
      line2: body.line2 ? String(body.line2) : "",
      city: String(body.city || ""),
      state: String(body.state || ""),
      pinCode: String(body.pinCode || ""),
      country: "India",
      isDefault: user.addresses.length === 0 || Boolean(body.isDefault),
    };
    if (addr.isDefault) {
      for (const a of user.addresses) a.isDefault = false;
    }
    user.addresses.push(addr);
    writeStore(db);
    return NextResponse.json({ addresses: user.addresses });
  }

  if (body.action === "delete_address") {
    user.addresses = user.addresses.filter((a) => a.id !== body.addressId);
    writeStore(db);
    return NextResponse.json({ addresses: user.addresses });
  }

  if (typeof body.name === "string" && body.name.trim()) {
    user.name = body.name.trim();
  }
  if (typeof body.phone === "string" && body.phone.trim()) {
    user.phone = body.phone.trim();
  }
  if (body.preferredLanguage === "en" || body.preferredLanguage === "mr") {
    user.preferredLanguage = body.preferredLanguage;
  }

  writeStore(db);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferredLanguage: user.preferredLanguage,
    },
  });
}
