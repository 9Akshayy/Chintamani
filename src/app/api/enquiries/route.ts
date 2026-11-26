import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

const enquirySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(5),
  productSku: z.string().optional(),
});

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const db = readStore();
  return NextResponse.json({ enquiries: db.contactEnquiries });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid enquiry details" },
      { status: 400 }
    );
  }
  const db = readStore();
  const enquiry = {
    id: `enq-${Date.now()}`,
    ...parsed.data,
    status: "NEW" as const,
    createdAt: new Date().toISOString(),
  };
  db.contactEnquiries.unshift(enquiry);
  writeStore(db);
  return NextResponse.json({
    enquiry,
    message: "Thank you for contacting Chintamani Jewellers. Our team will respond shortly.",
  });
}
