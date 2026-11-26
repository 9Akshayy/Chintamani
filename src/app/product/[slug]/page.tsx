import React from "react";
import { notFound } from "next/navigation";
import { enrichProductWithPrice, readStore } from "@/lib/store";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = readStore();
  const product = db.products.find((p) => p.slug === slug && p.isPublished);
  if (!product) {
    notFound();
  }

  const enriched = enrichProductWithPrice(product, db.metalRates);
  const related = db.products
    .filter(
      (p) =>
        p.isPublished &&
        p.id !== product.id &&
        (p.categoryId === product.categoryId || p.metalType === product.metalType)
    )
    .slice(0, 4)
    .map((p) => enrichProductWithPrice(p, db.metalRates));

  const reviews = db.reviews.filter(
    (r) => r.productId === product.id && r.status === "APPROVED"
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: enriched.name,
    sku: enriched.sku,
    description: enriched.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: enriched.price.finalPrice,
      availability:
        enriched.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={enriched}
        related={related}
        reviews={reviews}
        settings={db.settings}
      />
    </>
  );
}
