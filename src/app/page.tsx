import React from "react";
import { enrichProductWithPrice, readStore } from "@/lib/store";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = readStore();
  const activeBanners = db.banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeCategories = db.categories
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const published = db.products
    .filter((p) => p.isPublished)
    .map((p) => enrichProductWithPrice(p, db.metalRates));

  const bestSellers = published.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = published.filter((p) => p.isNewArrival).slice(0, 8);
  const testimonials = db.reviews.filter(
    (r) => r.status === "APPROVED" && r.isFeaturedTestimonial
  );
  const primaryStore = db.stores.find((s) => s.isActive) || null;

  return (
    <HomeClient
      settings={db.settings}
      banners={activeBanners}
      rates={db.metalRates}
      categories={activeCategories}
      bestSellers={bestSellers}
      newArrivals={newArrivals}
      testimonials={testimonials}
      store={primaryStore}
    />
  );
}
