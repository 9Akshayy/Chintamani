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
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Category name required" }, { status: 400 });
  }
  const slug =
    String(body.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const category = {
    id: `cat-${Date.now()}`,
    name,
    nameMr: String(body.nameMr || name),
    slug,
    description: String(body.description || ""),
    imageUrl: String(body.imageUrl || "/images/cat-gold-necklace.jpg"),
    sortOrder: Number(body.sortOrder ?? db.categories.length + 1),
    isActive: body.isActive !== false,
  };
  db.categories.push(category);
  writeStore(db);
  return NextResponse.json({ category });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const cat = db.categories.find((c) => c.id === body.id);
  if (!cat) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  if (typeof body.name === "string") cat.name = body.name;
  if (typeof body.sortOrder === "number") cat.sortOrder = body.sortOrder;
  if (typeof body.isActive === "boolean") cat.isActive = body.isActive;
  writeStore(db);
  return NextResponse.json({ category: cat });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const db = readStore();
  db.categories = db.categories.filter((c) => c.id !== id);
  writeStore(db);
  return NextResponse.json({ success: true });
}
