import React from "react";
import { notFound } from "next/navigation";

const GUIDES: Record<
  string,
  { title: string; subtitle: string; sections: { heading: string; body: string }[] }
> = {
  "jewellery-care": {
    title: "Jewellery Care Guide",
    subtitle: "Preserve the brilliance of your gold, diamond, silver, and platinum heirlooms.",
    sections: [
      {
        heading: "Daily Wear & Storage",
        body: "Store each piece separately in a soft velvet or fabric-lined box to avoid scratches. Always apply perfumes, lotions, and hairspray before putting on your jewellery.",
      },
      {
        heading: "Cleaning Gold & Diamonds",
        body: "Soak plain gold or diamond jewellery briefly in lukewarm water with mild liquid soap, gently brush with a soft-bristled brush, rinse in clean water, and pat dry with a lint-free cloth.",
      },
      {
        heading: "Silver & Pearl Care",
        body: "Keep 925 silver in airtight zip pouches to slow natural oxidation. Never soak pearls, kundan, or meenakari pieces in water; wipe gently with a dry soft cloth.",
      },
    ],
  },
  "ring-size": {
    title: "Ring Size Guide",
    subtitle: "Find your accurate Indian ring size comfortably at home.",
    sections: [
      {
        heading: "Measuring Existing Ring Diameter",
        body: "Place a well-fitting ring flat on a ruler and measure the internal diameter in millimetres: 15.9mm ≈ Size 10, 16.5mm ≈ Size 12, 17.2mm ≈ Size 14, 17.8mm ≈ Size 16, 18.5mm ≈ Size 18.",
      },
      {
        heading: "Measuring Finger Circumference",
        body: "Wrap a thin strip of paper snugly around the base of your finger at room temperature (fingers expand slightly in warm weather). Mark the overlap and measure in millimetres.",
      },
    ],
  },
  "gold-purity": {
    title: "Gold Purity Guide",
    subtitle: "Understanding 24KT, 22KT, 18KT, and 14KT gold.",
    sections: [
      {
        heading: "24KT (999) — Pure Gold",
        body: "99.9% pure gold, primarily used for investment coins and bullion bars because pure gold is naturally soft for daily-wear settings.",
      },
      {
        heading: "22KT (916) — Traditional Jewellery",
        body: "Contains 91.6% pure gold alloyed with 8.4% strengthening metals. Ideal for necklaces, bangles, mangalsutras, and heritage Indian jewellery.",
      },
      {
        heading: "18KT (750) & 14KT (585) — Diamond & Contemporary Wear",
        body: "75% and 58.5% pure gold respectively, offering superior durability for secure diamond prong settings and modern rose/white gold designs.",
      },
    ],
  },
  diamond: {
    title: "Diamond Guide",
    subtitle: "Understanding the 4Cs of natural diamonds: Cut, Clarity, Colour, and Carat.",
    sections: [
      {
        heading: "Cut & Brilliance",
        body: "Cut determines how effectively a diamond reflects light. Well-proportioned facets create crisp sparkle and fire.",
      },
      {
        heading: "Colour & Clarity",
        body: "Fine Indian jewellery typically pairs near-colourless grades (EF–GH) with eye-clean clarity grades (VVS–VS) for balanced brilliance and value.",
      },
    ],
  },
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Chintamani Educational Guide
          </p>
          <h1 className="mt-1 font-luxury text-4xl font-semibold text-[#221F1B]">
            {guide.title}
          </h1>
          <p className="mt-2 text-sm text-[#6A6258]">{guide.subtitle}</p>
        </div>
        <div className="space-y-5">
          {guide.sections.map((s) => (
            <div
              key={s.heading}
              className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/60 p-6"
            >
              <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                {s.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6A6258]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
