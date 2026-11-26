import { NextResponse } from "next/server";
import { enrichProductWithPrice, readStore } from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const db = readStore();
  const product = db.products.find(
    (p) => p.slug === slug && p.isPublished
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
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

  return NextResponse.json({
    product: enriched,
    related,
    reviews,
    settings: db.settings,
  });
}
