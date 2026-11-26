import React from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AllJewelleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const db = readStore();

  return (
    <CatalogClient
      title="All Fine Jewellery"
      subtitle="Explore our complete demonstration catalogue across 22KT Gold, 18KT Diamonds, Silver, Platinum, and Bullion."
      initialCategory={sp.category || "all"}
      initialOccasion={sp.occasion || ""}
      initialCollection={sp.collection || ""}
      initialQuery={sp.q || ""}
      initialSort={sp.sort || "popularity"}
      categories={db.categories.filter((c) => c.isActive)}
    />
  );
}
