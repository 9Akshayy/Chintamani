"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gem,
  HeartHandshake,
  Mail,
  MapPin,
  Minus,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { formatINR } from "@/lib/pricing";
import type {
  DemoBanner,
  DemoCategory,
  DemoMetalRate,
  DemoReview,
  DemoStoreLocation,
  SiteSettingsConfig,
} from "@/lib/demo-data";
import type { EnrichedProduct } from "@/lib/store";
import { ProductCard } from "./ProductCard";

interface HomeClientProps {
  settings: SiteSettingsConfig;
  banners: DemoBanner[];
  rates: DemoMetalRate[];
  categories: DemoCategory[];
  bestSellers: EnrichedProduct[];
  newArrivals: EnrichedProduct[];
  testimonials: DemoReview[];
  store: DemoStoreLocation | null;
}

const OCCASIONS = [
  { name: "Wedding Collection", subtitle: "Heirloom sets & bridal finery", image: "/images/hero-bridal.jpg" },
  { name: "Bridal Jewellery", subtitle: "Regal chokers, harams & kangan", image: "/images/cat-gold-necklace.jpg" },
  { name: "Daily Wear", subtitle: "Featherlight gold & diamond staples", image: "/images/cat-mangalsutra.jpg" },
  { name: "Office Wear", subtitle: "Minimalist rings, studs & chains", image: "/images/hero-diamond.jpg" },
  { name: "Festive Collection", subtitle: "Auspicious Diwali & Akshaya Tritiya", image: "/images/cat-bangles.jpg" },
  { name: "Traditional Jewellery", subtitle: "Heritage Maharashtrian karigari", image: "/images/cat-gold-necklace.jpg" },
  { name: "Anniversary Gifts", subtitle: "Solitaires & eternity bands", image: "/images/cat-gold-rings.jpg" },
  { name: "Birthday Gifts", subtitle: "Thoughtful keepsakes in gold & silver", image: "/images/hero-diamond.jpg" },
];

const FEATURED_COLLECTIONS = [
  {
    name: "Traditional Gold Collection",
    desc: "Temple harams, kolhapuri saaj & heritage 22KT craftsmanship.",
    href: "/jewellery?collection=Traditional",
    image: "/images/cat-gold-necklace.jpg",
  },
  {
    name: "Diamond Collection",
    desc: "Brilliant-cut solitaires and 18KT fine diamond creations.",
    href: "/jewellery?collection=Diamond",
    image: "/images/hero-diamond.jpg",
  },
  {
    name: "Lightweight Jewellery",
    desc: "Effortless everyday pieces designed for all-day comfort.",
    href: "/jewellery?collection=Lightweight",
    image: "/images/cat-gold-rings.jpg",
  },
  {
    name: "Bridal Collection",
    desc: "Bespoke bridal sets crafted for your most cherished day.",
    href: "/jewellery?collection=Bridal",
    image: "/images/hero-bridal.jpg",
  },
  {
    name: "Everyday Luxury",
    desc: "Refined mangalsutras, bracelets, and chains for modern life.",
    href: "/jewellery?collection=Everyday",
    image: "/images/cat-mangalsutra.jpg",
  },
];

export function HomeClient({
  settings,
  banners,
  rates,
  categories,
  bestSellers,
  newArrivals,
  testimonials,
  store,
}: HomeClientProps) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const activeBanner = banners[bannerIndex] || banners[0];

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterStatus(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewsletterStatus(data.message);
      setNewsletterEmail("");
    } else {
      setNewsletterStatus(data.error || "Unable to subscribe");
    }
  }

  return (
    <div className="bg-white pb-14 lg:pb-0">
      {/* SECTION 1: FULL-WIDTH ROUNDED HERO BANNER CAROUSEL */}
      {activeBanner && (
        <section className="bg-[#FAF7F2] pt-2 sm:pt-3 pb-3 sm:pb-4">
          <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
            <div className="relative h-[280px] sm:h-[420px] lg:h-[500px] w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeBanner.desktopImageUrl}
                alt={activeBanner.headline}
                className="h-full w-full object-cover object-center transition-all duration-700"
              />

              {/* Gradient for readable caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Left / Right Circular Gold Arrow Controls (hidden on small touch phones, shown on sm+) */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerIndex(
                        (prev) => (prev - 1 + banners.length) % banners.length
                      )
                    }
                    className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#9A6F26]/75 text-white backdrop-blur-sm transition hover:bg-[#9A6F26]"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerIndex((prev) => (prev + 1) % banners.length)
                    }
                    className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#9A6F26]/75 text-white backdrop-blur-sm transition hover:bg-[#9A6F26]"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Editorial Caption & CTAs */}
              <div className="absolute bottom-6 left-4 right-4 sm:bottom-10 sm:left-10 max-w-xl text-white">
                <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#F2D399]">
                  {activeBanner.subtitle}
                </p>
                <h1 className="mt-0.5 sm:mt-1 font-luxury text-xl sm:text-3xl md:text-5xl font-semibold leading-tight drop-shadow">
                  {activeBanner.headline}
                </h1>
                <p className="mt-1 hidden sm:block text-xs sm:text-sm text-white/90 max-w-md line-clamp-2">
                  {activeBanner.description}
                </p>
                <div className="mt-2.5 sm:mt-3.5 flex flex-wrap items-center gap-2">
                  <Link
                    href={activeBanner.ctaLink}
                    className="inline-flex items-center gap-1 rounded-full bg-[#C59B5F] px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-semibold text-white hover:bg-[#A67C42]"
                  >
                    {activeBanner.ctaText}
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                  {activeBanner.secondaryCtaText && (
                    <Link
                      href={activeBanner.secondaryCtaLink || "/jewellery"}
                      className="inline-flex items-center rounded-full border border-white/70 bg-black/30 px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs md:text-sm font-semibold text-white backdrop-blur-sm hover:bg-white hover:text-[#221F1B]"
                    >
                      {activeBanner.secondaryCtaText}
                    </Link>
                  )}
                </div>
              </div>

              {/* Centered Dot Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2">
                  {banners.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBannerIndex(idx)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all ${
                        idx === bannerIndex
                          ? "w-5 sm:w-6 bg-[#C59B5F]"
                          : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CIRCULAR CATEGORY STRIP (Right Below Hero) */}
      <section className="border-b border-[#EFE8DC] bg-[#FAF7F2] py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto pb-2 no-scrollbar justify-start lg:justify-between snap-x">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/jewellery?category=${cat.slug}`}
                className="group flex shrink-0 flex-col items-center text-center w-18 sm:w-24 snap-start"
              >
                <div className="h-16 w-16 sm:h-22 sm:w-22 overflow-hidden rounded-full border-2 border-[#EFE8DC] bg-white p-0.5 shadow-sm transition-all duration-300 group-hover:border-[#C59B5F] group-hover:scale-105 active:scale-95">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-[#221F1B] group-hover:text-[#9A6F26] line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE GOLD & SILVER RATES */}
      <section id="live-rates" className="border-b border-[#EFE8DC] bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 mb-5 sm:mb-7">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
                Daily Bullion &amp; Metal Board
              </p>
              <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
                Today&apos;s Metal Rates
              </h2>
            </div>
            <div className="text-[11px] sm:text-xs text-[#6A6258]">
              Updated by Admin (Demo Sample) •{" "}
              {new Date(rates[0]?.updatedAt || Date.now()).toLocaleDateString("en-IN")}
            </div>
          </div>

          <div className="grid gap-2.5 sm:gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {rates.map((rate) => {
              const diff = rate.ratePerGram - rate.previousRatePerGram;
              return (
                <div
                  key={rate.id}
                  className="rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/70 p-3 sm:p-4 transition-colors hover:border-[#C59B5F]"
                >
                  <div className="text-[11px] sm:text-xs font-medium text-[#6A6258] truncate">
                    {rate.label}
                  </div>
                  <div className="mt-1 text-base sm:text-xl font-bold text-[#221F1B]">
                    {formatINR(rate.ratePerGram)}
                    <span className="text-[10px] sm:text-xs font-normal text-[#6A6258]">
                      {" "}
                      /g
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px]">
                    {diff > 0 ? (
                      <span className="inline-flex items-center gap-0.5 font-medium text-emerald-700">
                        <ArrowUpRight className="h-3 w-3" />+{formatINR(diff)}
                      </span>
                    ) : diff < 0 ? (
                      <span className="inline-flex items-center gap-0.5 font-medium text-red-600">
                        <ArrowDownRight className="h-3 w-3" />
                        {formatINR(diff)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[#6A6258]">
                        <Minus className="h-2.5 w-2.5" /> 0
                      </span>
                    )}
                    <span className="rounded bg-white px-1 py-0.2 text-[9px] text-[#6A6258] border border-[#EFE8DC]">
                      {rate.isDemo ? "Demo" : rate.source}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: SHOP BY CATEGORY (All 12 Categories) */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]/50">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Curated Categories
            </p>
            <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              Shop By Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/jewellery?category=${cat.slug}`}
                className="group overflow-hidden rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-white p-2.5 sm:p-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#C59B5F] hover:shadow-sm"
              >
                <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-[#FAF7F2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 sm:mt-3 font-luxury text-sm sm:text-lg font-semibold text-[#221F1B] group-hover:text-[#A67C42] truncate">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS (2-Column Mobile Grid) */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-end justify-between mb-5 sm:mb-8">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
                Customer Favourites
              </p>
              <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/jewellery?sort=best_sellers"
              className="text-xs sm:text-sm font-medium text-[#A67C42] hover:text-[#221F1B] inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SHOP BY OCCASION */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Celebrate Every Milestone
            </p>
            <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              Shop By Occasion
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.name}
                href={`/jewellery?occasion=${encodeURIComponent(occ.name)}`}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-white p-3 sm:p-4 flex items-center gap-3.5 hover:border-[#C59B5F] hover:shadow-sm transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover shrink-0 border border-[#EFE8DC]"
                />
                <div className="min-w-0">
                  <h3 className="font-luxury text-base sm:text-lg font-semibold text-[#221F1B] group-hover:text-[#A67C42] truncate">
                    {occ.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6A6258] truncate">{occ.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: NEW ARRIVALS (2-Column Mobile Grid) */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-end justify-between mb-5 sm:mb-8">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
                Fresh From Atelier
              </p>
              <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/jewellery?sort=newest"
              className="text-xs sm:text-sm font-medium text-[#A67C42] hover:text-[#221F1B] inline-flex items-center gap-1"
            >
              Explore New <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FEATURED COLLECTIONS */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]/60">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Signature Edits
            </p>
            <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              Featured Collections
            </h2>
          </div>

          <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {FEATURED_COLLECTIONS.map((col) => (
              <Link
                key={col.name}
                href={col.href}
                className="group overflow-hidden rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-white flex flex-col hover:border-[#C59B5F] hover:shadow-sm transition-all"
              >
                <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#FAF7F2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.image}
                    alt={col.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-luxury text-lg sm:text-xl font-semibold text-[#221F1B] group-hover:text-[#A67C42]">
                      {col.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#6A6258] line-clamp-2">{col.desc}</p>
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#A67C42]">
                    Explore <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: WHY CHOOSE US */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              The Chintamani Promise
            </p>
            <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid gap-3.5 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {settings.verifiedTrustBadges
              .filter((b) => b.verified)
              .map((badge, idx) => {
                const Icons = [
                  Award,
                  Sparkles,
                  Gem,
                  ShieldCheck,
                  HeartHandshake,
                  Star,
                ];
                const Icon = Icons[idx % Icons.length];
                return (
                  <div
                    key={badge.title}
                    className="rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/60 p-4 sm:p-6"
                  >
                    <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white border border-[#C59B5F]/40 text-[#A67C42]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-luxury text-xl sm:text-2xl font-semibold text-[#221F1B]">
                      {badge.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#6A6258]">
                      {badge.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* SECTION 9: ABOUT OUR BRAND */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2]">
        <div className="mx-auto grid max-w-7xl items-center gap-6 sm:gap-10 px-3 sm:px-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EFE8DC] shadow-sm aspect-[16/10] sm:aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-bridal.jpg"
              alt="Chintamani Jewellers Craftsmanship"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-3 sm:space-y-5">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Our Heritage &amp; Craftsmanship
            </p>
            <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              {settings.aboutHeadline}
            </h2>
            <p className="text-xs sm:text-base leading-relaxed text-[#6A6258]">
              {settings.aboutStory}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#221F1B] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-[#A67C42]"
            >
              Read More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 10: CUSTOMER TESTIMONIALS */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Patron Stories
            </p>
            <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
              Customer Testimonials
            </h2>
          </div>

          <div className="grid gap-3.5 sm:gap-6 grid-cols-1 md:grid-cols-3">
            {testimonials.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl sm:rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/50 p-4 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C59B5F]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  {rev.title && (
                    <h3 className="mt-2 font-luxury text-lg sm:text-xl font-semibold text-[#221F1B]">
                      {rev.title}
                    </h3>
                  )}
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#6A6258]">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-4 border-t border-[#EFE8DC] pt-2.5 text-xs font-semibold text-[#221F1B]">
                  {rev.customerName}
                  {rev.city && (
                    <span className="font-normal text-[#6A6258]">
                      {" "}
                      • {rev.city}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: STORE INFORMATION */}
      {store && (
        <section className="py-10 sm:py-16 bg-[#FAF7F2]">
          <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 px-3 sm:px-4 md:grid-cols-2 items-center">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
                Visit Our Showroom
              </p>
              <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
                {store.name}
              </h2>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-[#6A6258]">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#A67C42] mt-0.5" />
                  <span>
                    {store.addressLine}, {store.city}, {store.state} –{" "}
                    {store.pinCode}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#A67C42]" />
                  <span>{store.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#A67C42]" />
                  <span>{store.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#A67C42]" />
                  <span>{store.openingHours}</span>
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={store.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#221F1B] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#A67C42]"
                >
                  Get Directions <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/store-locator"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C59B5F] bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-[#221F1B] hover:bg-[#FAF7F2]"
                >
                  Store Details
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EFE8DC] bg-white shadow-sm h-64 sm:h-80">
              <iframe
                title={store.name}
                src={store.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 12: NEWSLETTER */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-3 sm:px-4 text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Private Invitations &amp; Launches
          </p>
          <h2 className="mt-1 font-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#221F1B]">
            Stay Updated
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6A6258]">
            Receive new collection previews, festive offers, and daily rate highlights.
          </p>
          <form
            onSubmit={handleNewsletter}
            className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 rounded-full border border-[#EFE8DC] bg-[#FAF7F2] px-4 py-2.5 text-xs sm:text-sm text-[#221F1B] focus:border-[#C59B5F] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              Subscribe
            </button>
          </form>
          {newsletterStatus && (
            <p className="mt-2 text-xs font-medium text-emerald-700">
              {newsletterStatus}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
