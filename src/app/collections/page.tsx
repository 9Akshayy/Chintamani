import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    name: "Traditional Gold Collection",
    desc: "Temple necklaces, kangan bangles, and heritage Maharashtrian designs in 22KT gold.",
    image: "/images/cat-gold-necklace.jpg",
    href: "/jewellery?collection=Traditional",
  },
  {
    name: "Diamond Collection",
    desc: "Solitaire rings, diamond bracelets, and modern 18KT fine jewellery.",
    image: "/images/hero-diamond.jpg",
    href: "/jewellery?collection=Diamond",
  },
  {
    name: "Bridal Collection",
    desc: "Complete bridal sets crafted for weddings and auspicious ceremonies.",
    image: "/images/hero-bridal.jpg",
    href: "/jewellery?collection=Bridal",
  },
  {
    name: "Lightweight Jewellery",
    desc: "Graceful, comfortable pieces for daily elegance and gifting.",
    image: "/images/cat-gold-rings.jpg",
    href: "/jewellery?collection=Lightweight",
  },
  {
    name: "Everyday Luxury",
    desc: "Modern mangalsutras, chains, and platinum bands for effortless style.",
    image: "/images/cat-mangalsutra.jpg",
    href: "/jewellery?collection=Everyday",
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Curated Signatures
          </p>
          <h1 className="font-luxury text-4xl sm:text-5xl font-semibold text-[#221F1B]">
            Our Collections
          </h1>
          <p className="mt-2 text-sm text-[#6A6258]">
            Discover thoughtfully curated edits across bridal, traditional,
            diamond, and everyday fine jewellery.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              className="group overflow-hidden rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2]/50 hover:border-[#C59B5F] hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-luxury text-2xl font-semibold text-[#221F1B] group-hover:text-[#A67C42]">
                  {c.name}
                </h2>
                <p className="mt-2 text-sm text-[#6A6258]">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A67C42]">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
