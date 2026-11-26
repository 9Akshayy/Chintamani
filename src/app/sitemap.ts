import type { MetadataRoute } from "next";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://chintamanijewellers.example";
  const db = readStore();

  const staticRoutes = [
    "",
    "/jewellery",
    "/jewellery/gold",
    "/jewellery/diamond",
    "/jewellery/silver",
    "/jewellery/platinum",
    "/jewellery/gold-coins",
    "/jewellery/silver-coins",
    "/jewellery/bullion",
    "/collections",
    "/about",
    "/contact",
    "/store-locator",
    "/faq",
    "/guides/jewellery-care",
    "/guides/ring-size",
    "/guides/gold-purity",
    "/guides/diamond",
    "/policies/shipping",
    "/policies/returns",
    "/policies/refund",
    "/policies/privacy",
    "/policies/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const productRoutes = db.products
    .filter((p) => p.isPublished)
    .map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
    }));

  return [...staticRoutes, ...productRoutes];
}
