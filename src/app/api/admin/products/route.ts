import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { enrichProductWithPrice, readStore, writeStore } from "@/lib/store";
import type { DemoProduct } from "@/lib/demo-data";

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const db = readStore();
  const category = db.categories.find(
    (c) => c.id === body.categoryId || c.slug === body.categorySlug
  );
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const sku = String(body.sku || "").trim();
  if (!name || !sku) {
    return NextResponse.json(
      { error: "Product name and SKU are required." },
      { status: 400 }
    );
  }

  const slugBase = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

  const product: DemoProduct = {
    id: `prod-${Date.now()}`,
    name,
    nameMr: String(body.nameMr || name),
    slug,
    sku,
    shortDescription: String(body.shortDescription || name),
    description: String(body.description || body.shortDescription || name),
    metalType: body.metalType || "GOLD",
    purity: String(body.purity || "22KT"),
    diamondQuality: body.diamondQuality || null,
    grossWeightGrams: Number(body.grossWeightGrams || 10),
    netWeightGrams: Number(body.netWeightGrams || 10),
    stoneWeightGrams: Number(body.stoneWeightGrams || 0),
    makingChargeType: body.makingChargeType || "PERCENTAGE",
    makingChargeValue: Number(body.makingChargeValue ?? 12),
    stoneCharges: Number(body.stoneCharges || 0),
    additionalCharges: Number(body.additionalCharges || 0),
    gstPercent: Number(body.gstPercent ?? 3),
    hsnCode: String(body.hsnCode || "7113"),
    fixedPriceOverride: body.fixedPriceOverride ? Number(body.fixedPriceOverride) : null,
    occasions: Array.isArray(body.occasions) ? body.occasions : ["Wedding Collection"],
    collectionTag: body.collectionTag || "Traditional Gold Collection",
    sizeOptions: Array.isArray(body.sizeOptions) && body.sizeOptions.length > 0
      ? body.sizeOptions
      : ["Standard"],
    videoUrl: body.videoUrl || null,
    careInstructions: String(
      body.careInstructions || "Store in a dry, soft-lined jewellery box."
    ),
    estimatedDeliveryDays: Number(body.estimatedDeliveryDays || 5),
    isBestSeller: Boolean(body.isBestSeller),
    isFeatured: Boolean(body.isFeatured),
    isNewArrival: body.isNewArrival !== false,
    isPublished: body.isPublished !== false,
    isDemo: Boolean(body.isDemo),
    popularityScore: 80,
    stockQuantity: Number(body.stockQuantity ?? 5),
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    images: [
      {
        id: `img-${Date.now()}`,
        url: String(body.imageUrl || category.imageUrl || "/images/cat-gold-necklace.jpg"),
        altText: name,
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(product);
  writeStore(db);
  return NextResponse.json({
    product: enrichProductWithPrice(product, db.metalRates),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  const product = db.products.find((p) => p.id === body.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const editableFields = [
    "name",
    "sku",
    "shortDescription",
    "description",
    "metalType",
    "purity",
    "grossWeightGrams",
    "netWeightGrams",
    "stoneWeightGrams",
    "makingChargeType",
    "makingChargeValue",
    "stoneCharges",
    "additionalCharges",
    "gstPercent",
    "hsnCode",
    "stockQuantity",
    "isBestSeller",
    "isFeatured",
    "isNewArrival",
    "isPublished",
    "collectionTag",
  ] as const;

  for (const field of editableFields) {
    if (body[field] !== undefined) {
      // @ts-expect-error dynamic assignment for validated admin fields
      product[field] = body[field];
    }
  }

  if (typeof body.imageUrl === "string" && body.imageUrl.trim()) {
    product.images = [
      {
        id: product.images[0]?.id || `img-${Date.now()}`,
        url: body.imageUrl.trim(),
        altText: product.name,
        sortOrder: 1,
        isPrimary: true,
      },
      ...product.images.slice(1),
    ];
  }

  writeStore(db);
  return NextResponse.json({
    product: enrichProductWithPrice(product, db.metalRates),
  });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const db = readStore();
  db.products = db.products.filter((p) => p.id !== id);
  writeStore(db);
  return NextResponse.json({ success: true });
}
