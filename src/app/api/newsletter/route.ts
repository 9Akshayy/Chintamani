import { NextResponse } from "next/server";
import { z } from "zod";
import { readStore, writeStore } from "@/lib/store";

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid email" },
      { status: 400 }
    );
  }

  const db = readStore();
  const emailLower = parsed.data.email.toLowerCase();
  if (!db.newsletterSubscribers.some((s) => s.email === emailLower)) {
    db.newsletterSubscribers.push({
      id: `sub-${Date.now()}`,
      email: emailLower,
      createdAt: new Date().toISOString(),
    });
    writeStore(db);
  }

  return NextResponse.json({
    success: true,
    message: "Subscribed! You will receive updates on our latest collections.",
  });
}
