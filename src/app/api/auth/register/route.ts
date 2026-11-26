import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, SESSION_COOKIE_NAME, signSessionToken } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(10, "Valid 10-digit mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const db = readStore();
    const emailLower = parsed.data.email.toLowerCase();
    const existing = db.users.find((u) => u.email.toLowerCase() === emailLower);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: parsed.data.name,
      email: emailLower,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER" as const,
      isActive: true,
      preferredLanguage: "en" as const,
      rewardPoints: 0,
      kycVerified: false,
      createdAt: new Date().toISOString(),
      addresses: [],
      wishlistProductIds: [],
    };

    db.users.push(newUser);
    writeStore(db);

    const token = await signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const res = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Unable to register account." },
      { status: 500 }
    );
  }
}
