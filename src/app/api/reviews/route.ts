import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession, requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

const reviewSchema = z.object({
  productId: z.string().optional().nullable(),
  customerName: z.string().trim().min(2),
  city: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().trim().min(5),
});

export async function GET() {
  const admin = await requireAdminSession();
  const db = readStore();
  if (admin) {
    return NextResponse.json({ reviews: db.reviews });
  }
  return NextResponse.json({
    reviews: db.reviews.filter((r) => r.status === "APPROVED"),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid review" },
      { status: 400 }
    );
  }
  const session = await getCurrentSession();
  const db = readStore();
  const product = parsed.data.productId
    ? db.products.find((p) => p.id === parsed.data.productId)
    : null;

  const review = {
    id: `rev-${Date.now()}`,
    productId: parsed.data.productId || null,
    productName: product?.name || null,
    userId: session?.userId || null,
    customerName: parsed.data.customerName,
    city: parsed.data.city || "",
    rating: parsed.data.rating,
    title: parsed.data.title || "",
    comment: parsed.data.comment,
    status: "PENDING" as const,
    isFeaturedTestimonial: false,
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(review);
  writeStore(db);
  return NextResponse.json({
    review,
    message: "Thank you! Your review has been submitted for moderation.",
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const rev = db.reviews.find((r) => r.id === body.id);
  if (!rev) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (body.status) rev.status = body.status;
  if (typeof body.isFeaturedTestimonial === "boolean") {
    rev.isFeaturedTestimonial = body.isFeaturedTestimonial;
  }
  if (typeof body.comment === "string") rev.comment = body.comment;
  writeStore(db);
  return NextResponse.json({ review: rev });
}
