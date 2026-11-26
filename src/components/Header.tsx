"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useStore } from "./StoreProvider";
import { formatINR } from "@/lib/pricing";
import type { EnrichedProduct } from "@/lib/store";
import type { DemoMetalRate, SiteSettingsConfig } from "@/lib/demo-data";

interface HeaderProps {
  settings: SiteSettingsConfig;
  metalRates: DemoMetalRate[];
}

const NAV_LINKS = [
  { label: "All Jewellery", labelMr: "सर्व दागिने", href: "/jewellery" },
  { label: "Diamond", labelMr: "हिरे", href: "/jewellery/diamond" },
  { label: "Gold", labelMr: "सोने", href: "/jewellery/gold" },
  { label: "Platinum", labelMr: "प्लॅटिनम", href: "/jewellery/platinum" },
  { label: "Silver", labelMr: "चांदी", href: "/jewellery/silver" },
  { label: "Bullions", labelMr: "बुलियन", href: "/jewellery/bullion" },
  { label: "Collections", labelMr: "कलेक्शन", href: "/collections" },
];

export function Header({ settings, metalRates }: HeaderProps) {
  const { cart, user, lang, setLang, setCartOpen } = useStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<EnrichedProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const gold24k = metalRates.find((r) => r.metalKey === "GOLD_24KT");
  const gold22k = metalRates.find((r) => r.metalKey === "GOLD_22KT");

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(trimmed)}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
        }
      } finally {
        setSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    setMobileSearchOpen(false);
    router.push(`/jewellery?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2] shadow-sm">
      {/* Top Gold Gradient Rate Bar */}
      <div className="bg-gradient-to-r from-[#7A5110] via-[#A97822] to-[#6B4309] text-white text-[11px] sm:text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 py-1.5 sm:py-2">
          {/* Rate display */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-medium truncate">
            <Link href="/#live-rates" className="hover:underline flex items-center gap-1.5 truncate">
              <span className="font-semibold shrink-0">Today&apos;s Rate:</span>{" "}
              {gold24k && (
                <span className="truncate">
                  24K {formatINR(gold24k.ratePerGram * 10)}/10g
                </span>
              )}
              {gold24k && gold22k && <span className="opacity-70">|</span>}
              {gold22k && (
                <span className="truncate">
                  22K {formatINR(gold22k.ratePerGram * 10)}/10g
                </span>
              )}
              {gold22k?.isDemo && (
                <span className="hidden sm:inline rounded bg-white/20 px-1 py-0.2 text-[9px]">
                  Demo
                </span>
              )}
            </Link>
          </div>

          {/* Quick links & Language Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-4 font-medium shrink-0">
            <Link href="/store-locator" className="hover:underline hidden sm:inline">
              Store Locator
            </Link>
            <Link href="/contact" className="hover:underline hidden sm:inline">
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "mr" : "en")}
              className="rounded border border-white/40 bg-white/10 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold hover:bg-white/25 active:scale-95 transition"
              aria-label="Switch language"
            >
              {lang === "en" ? "मराठी" : "EN"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Row Header */}
      <div className="border-b border-[#EFE8DC] bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3">
          {/* Left: Mobile Menu + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1 text-[#221F1B] hover:bg-white lg:hidden shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logoUrl || "/images/brand-crest.svg"}
                alt={settings.businessName}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-contain border border-[#C59B5F]/50 bg-white p-0.5 shrink-0"
              />
              <span className="font-luxury text-base sm:text-xl md:text-2xl font-bold tracking-wider uppercase text-[#9A6F26] leading-none truncate">
                {settings.businessName}
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-[#221F1B]">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-[#9A6F26]"
              >
                {lang === "mr" ? item.labelMr : item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Inline Search Input (Desktop) & Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Desktop Search */}
            <div className="relative hidden md:block w-52 lg:w-64">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder="Search jewellery..."
                  className="w-full rounded-lg border border-[#E2D6C3] bg-white pl-3.5 pr-9 py-2 text-xs text-[#221F1B] placeholder:text-[#8A8074] focus:border-[#C59B5F] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-2 text-[#8A8074] hover:text-[#221F1B]"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Desktop Suggestions Dropdown */}
              {showDropdown && query.trim() && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#EFE8DC] bg-white p-2 shadow-2xl z-50">
                  <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] text-[#6A6258] border-b border-[#FAF7F2]">
                    <span>Search Results</span>
                    <button
                      type="button"
                      onClick={() => setShowDropdown(false)}
                      className="hover:text-[#221F1B]"
                    >
                      Close
                    </button>
                  </div>
                  {searching ? (
                    <p className="p-3 text-xs text-[#6A6258]">Searching...</p>
                  ) : suggestions.length === 0 ? (
                    <p className="p-3 text-xs text-[#6A6258]">
                      No jewellery matched &ldquo;{query}&rdquo;.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#FAF7F2] max-h-72 overflow-y-auto">
                      {suggestions.map((item) => (
                        <Link
                          key={item.id}
                          href={`/product/${item.slug}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between gap-2.5 rounded-xl p-2 hover:bg-[#FAF7F2]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                item.images[0]?.url ||
                                "/images/cat-gold-necklace.jpg"
                              }
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover border border-[#EFE8DC] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-[#221F1B] truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#6A6258]">
                                {item.sku} • {item.purity}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#9A6F26] shrink-0">
                            {formatINR(item.price.finalPrice)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className="p-1.5 text-[#221F1B] hover:text-[#9A6F26] md:hidden"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative flex flex-col items-center text-[#221F1B] hover:text-[#9A6F26]"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="h-5 w-5" />
                {user && user.wishlistProductIds.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9A6F26] text-[10px] font-bold text-white">
                    {user.wishlistProductIds.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] mt-0.5 font-medium">
                Wishlist
              </span>
            </Link>

            {/* Account Icon */}
            <Link
              href={
                user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")
                  ? "/admin"
                  : "/account"
              }
              className="flex flex-col items-center text-[#221F1B] hover:text-[#9A6F26]"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:block text-[10px] mt-0.5 font-medium">
                Account
              </span>
            </Link>

            {/* Cart Icon */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex flex-col items-center text-[#221F1B] hover:text-[#9A6F26]"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9A6F26] text-[10px] font-bold text-white">
                    {cart.itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] mt-0.5 font-medium">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Search Bar (Slide down when search icon is clicked) */}
        {mobileSearchOpen && (
          <div className="border-t border-[#EFE8DC] bg-white px-3 py-2.5 md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rings, necklaces, gold..."
                className="flex-1 rounded-lg border border-[#E2D6C3] px-3 py-1.5 text-xs text-[#221F1B] focus:border-[#C59B5F] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#221F1B] px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-1.5 text-[#6A6258]"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer (Enhanced for iOS & Android) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-white p-5 shadow-2xl h-full overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.logoUrl || "/images/brand-crest.svg"}
                  alt={settings.businessName}
                  className="h-8 w-8 rounded-full border border-[#C59B5F]/40 p-0.5"
                />
                <span className="font-luxury text-lg font-bold text-[#9A6F26]">
                  {settings.businessName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 text-[#6A6258] hover:text-[#221F1B]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A67C42] px-2 py-1">
                Jewellery Categories
              </span>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-[#221F1B] hover:bg-[#FAF7F2] active:bg-[#FAF7F2]"
                >
                  {lang === "mr" ? item.labelMr : item.label}
                </Link>
              ))}

              <hr className="border-[#EFE8DC] my-2" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A67C42] px-2 py-1">
                Showroom &amp; Assistance
              </span>
              <Link
                href="/store-locator"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm text-[#221F1B] hover:bg-[#FAF7F2]"
              >
                Store Locator (Ahilyanagar)
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm text-[#221F1B] hover:bg-[#FAF7F2]"
              >
                About Our Brand
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm text-[#221F1B] hover:bg-[#FAF7F2]"
              >
                Contact &amp; Custom Orders
              </Link>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#9A6F26] font-medium"
              >
                <Phone className="h-4 w-4" />
                Call Showroom
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm text-[#6A6258] hover:bg-[#FAF7F2]"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
