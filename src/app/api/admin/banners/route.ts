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
  const banner = {
    id: `banner-${Date.now()}`,
    title: String(body.title || "Promotional Banner"),
    subtitle: String(body.subtitle || "CHINTAMANI JEWELLERS"),
    headline: String(body.headline || "Elegance That Lasts Forever"),
    description: String(body.description || ""),
    ctaText: String(body.ctaText || "Explore Collection"),
    ctaLink: String(body.ctaLink || "/jewellery"),
    secondaryCtaText: body.secondaryCtaText || "Shop Now",
    secondaryCtaLink: body.secondaryCtaLink || "/collections",
    desktopImageUrl: String(body.desktopImageUrl || "/images/hero-bridal.jpg"),
    mobileImageUrl: String(body.mobileImageUrl || body.desktopImageUrl || "/images/hero-bridal.jpg"),
    sortOrder: Number(body.sortOrder ?? db.banners.length + 1),
    isActive: body.isActive !== false,
  };
  db.banners.push(banner);
  writeStore(db);
  return NextResponse.json({ banner });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const banner = db.banners.find((b) => b.id === body.id);
  if (!banner) {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }
  if (typeof body.isActive === "boolean") banner.isActive = body.isActive;
  if (typeof body.headline === "string") banner.headline = body.headline;
  if (typeof body.ctaLink === "string") banner.ctaLink = body.ctaLink;
  writeStore(db);
  return NextResponse.json({ banner });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const db = readStore();
  db.banners = db.banners.filter((b) => b.id !== id);
  writeStore(db);
  return NextResponse.json({ success: true });
}
