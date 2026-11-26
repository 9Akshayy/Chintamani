import { NextResponse } from "next/server";
import { z } from "zod";
import { readStore } from "@/lib/store";

const forgotSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid email" },
      { status: 400 }
    );
  }
  const db = readStore();
  const exists = db.users.some(
    (u) => u.email.toLowerCase() === parsed.data.email.toLowerCase()
  );

  return NextResponse.json({
    success: true,
    message: exists
      ? "If SMTP is configured, a password reset link has been sent to your email. In demo mode, please contact the store administrator."
      : "If an account exists with this email, a password reset instruction will be sent.",
  });
}
