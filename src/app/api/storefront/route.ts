import { NextResponse } from "next/server";
import { enrichProductWithPrice, readStore } from "@/lib/store";

export async function GET() {
  const db = readStore();
  const activeCategories = db.categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const publishedProducts = db.products
    .filter((p) => p.isPublished)
    .map((p) => enrichProductWithPrice(p, db.metalRates));

  const bestSellers = publishedProducts
    .filter((p) => p.isBestSeller)
    .slice(0, 8);
  const newArrivals = publishedProducts
    .filter((p) => p.isNewArrival)
    .slice(0, 8);
  const featured = publishedProducts.filter((p) => p.isFeatured).slice(0, 8);

  const testimonials = db.reviews.filter(
    (r) => r.status === "APPROVED" && r.isFeaturedTestimonial
  );

  return NextResponse.json({
    settings: db.settings,
    banners: db.banners
      .filter((b) => b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    categories: activeCategories,
    metalRates: db.metalRates,
    bestSellers,
    newArrivals,
    featured,
    testimonials,
    stores: db.stores.filter((s) => s.isActive),
    faqs: db.faqs.filter((f) => f.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
  });
}
