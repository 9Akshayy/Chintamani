import { NextResponse } from "next/server";
import { enrichProductWithPrice, readStore } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const metal = (searchParams.get("metal") || "").toUpperCase();
  const category = (searchParams.get("category") || "").toLowerCase();
  const purity = (searchParams.get("purity") || "").toUpperCase();
  const occasion = (searchParams.get("occasion") || "").toLowerCase();
  const collection = (searchParams.get("collection") || "").toLowerCase();
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 0);
  const minWeight = Number(searchParams.get("minWeight") || 0);
  const maxWeight = Number(searchParams.get("maxWeight") || 0);
  const sort = searchParams.get("sort") || "popularity";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") || 12)));

  const db = readStore();
  let items = db.products
    .filter((p) => p.isPublished)
    .map((p) => enrichProductWithPrice(p, db.metalRates));

  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.metalType.toLowerCase().includes(q) ||
        (p.collectionTag || "").toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (metal && metal !== "ALL") {
    if (metal === "COINS") {
      items = items.filter(
        (p) =>
          p.categorySlug === "gold-coins" || p.categorySlug === "silver-coins"
      );
    } else {
      items = items.filter((p) => p.metalType === metal);
    }
  }

  if (category && category !== "all") {
    items = items.filter((p) => p.categorySlug === category);
  }

  if (purity && purity !== "ALL") {
    items = items.filter((p) =>
      p.purity.toUpperCase().includes(purity.replace(/\s+/g, ""))
    );
  }

  if (occasion) {
    items = items.filter((p) =>
      p.occasions.some((o) => o.toLowerCase().includes(occasion))
    );
  }

  if (collection) {
    items = items.filter((p) =>
      (p.collectionTag || "").toLowerCase().includes(collection)
    );
  }

  if (inStockOnly) {
    items = items.filter((p) => p.stockQuantity > 0);
  }

  if (minPrice > 0) {
    items = items.filter((p) => p.price.finalPrice >= minPrice);
  }
  if (maxPrice > 0) {
    items = items.filter((p) => p.price.finalPrice <= maxPrice);
  }
  if (minWeight > 0) {
    items = items.filter((p) => p.netWeightGrams >= minWeight);
  }
  if (maxWeight > 0) {
    items = items.filter((p) => p.netWeightGrams <= maxWeight);
  }

  switch (sort) {
    case "price_asc":
      items.sort((a, b) => a.price.finalPrice - b.price.finalPrice);
      break;
    case "price_desc":
      items.sort((a, b) => b.price.finalPrice - a.price.finalPrice);
      break;
    case "newest":
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "best_sellers":
      items.sort(
        (a, b) =>
          Number(b.isBestSeller) - Number(a.isBestSeller) ||
          b.popularityScore - a.popularityScore
      );
      break;
    case "popularity":
    default:
      items.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return NextResponse.json({
    products: paginated,
    total,
    page,
    limit,
    totalPages,
    categories: db.categories.filter((c) => c.isActive),
  });
}
