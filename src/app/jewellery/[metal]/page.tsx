import React from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const METAL_PAGE_MAP: Record<
  string,
  { title: string; subtitle: string; metal: string; category?: string }
> = {
  gold: {
    title: "Gold Jewellery",
    subtitle: "Handcrafted 22KT & 18KT gold necklaces, rings, mangalsutras, bangles, and chains.",
    metal: "GOLD",
  },
  diamond: {
    title: "Diamond Jewellery",
    subtitle: "Brilliant-cut solitaire rings, pendants, and 18KT everyday luxury diamond creations.",
    metal: "DIAMOND",
  },
  silver: {
    title: "Silver Jewellery",
    subtitle: "925 sterling silver payal, accessories, and 999 auspicious silver gifts.",
    metal: "SILVER",
  },
  platinum: {
    title: "Platinum Jewellery",
    subtitle: "Pure 950 platinum couple bands and contemporary minimalist jewellery.",
    metal: "PLATINUM",
  },
  "gold-coins": {
    title: "Gold Coins",
    subtitle: "24KT 999 purity Lakshmi & minted investment gold coins.",
    metal: "BULLION",
    category: "gold-coins",
  },
  "silver-coins": {
    title: "Silver Coins",
    subtitle: "999 fine silver minted coins for festivals and auspicious gifting.",
    metal: "SILVER",
    category: "silver-coins",
  },
  bullion: {
    title: "Gold & Silver Bullion",
    subtitle: "24KT gold coins and 999 silver bullion with transparent pricing.",
    metal: "COINS",
  },
};

export default async function MetalJewelleryPage({
  params,
}: {
  params: Promise<{ metal: string }>;
}) {
  const { metal } = await params;
  const db = readStore();
  const cfg = METAL_PAGE_MAP[metal.toLowerCase()] || {
    title: "Fine Jewellery",
    subtitle: "Explore handcrafted jewellery from Chintamani Jewellers.",
    metal: "ALL",
  };

  return (
    <CatalogClient
      title={cfg.title}
      subtitle={cfg.subtitle}
      initialMetal={cfg.metal}
      initialCategory={cfg.category || "all"}
      categories={db.categories.filter((c) => c.isActive)}
    />
  );
}
