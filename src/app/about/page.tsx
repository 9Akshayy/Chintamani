import React from "react";
import Link from "next/link";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const db = readStore();
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Our Heritage &amp; Craftsmanship
          </p>
          <h1 className="font-luxury text-4xl sm:text-5xl font-semibold text-[#221F1B]">
            {db.settings.aboutHeadline}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-[#6A6258] leading-relaxed">
            {db.settings.aboutStory}
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#EFE8DC] aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-bridal.jpg"
            alt={db.settings.businessName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-6">
            <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
              Transparent Pricing
            </h2>
            <p className="mt-2 text-sm text-[#6A6258] leading-relaxed">
              Every piece clearly discloses net metal weight, stone weight,
              making charges, and GST so families can shop with complete peace
              of mind.
            </p>
          </div>
          <div className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-6">
            <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
              Artisanal Karigari
            </h2>
            <p className="mt-2 text-sm text-[#6A6258] leading-relaxed">
              From traditional Maharashtrian bridal harams and mangalsutras to
              modern 18KT diamond solitaires, each design is inspected for
              comfort and finish.
            </p>
          </div>
          <div className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-6">
            <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
              Personal Service
            </h2>
            <p className="mt-2 text-sm text-[#6A6258] leading-relaxed">
              Visit our Ahilyanagar showroom or connect on WhatsApp for custom
              sizing, family wedding consultations, and post-purchase care.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/jewellery"
            className="inline-block rounded-full bg-[#221F1B] px-7 py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
          >
            Explore Our Jewellery
          </Link>
        </div>
      </div>
    </div>
  );
}
