"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Filter, Grid, List, Search, SlidersHorizontal, X } from "lucide-react";
import type { DemoCategory } from "@/lib/demo-data";
import type { EnrichedProduct } from "@/lib/store";
import { ProductCard } from "./ProductCard";

interface CatalogClientProps {
  title: string;
  subtitle: string;
  initialMetal?: string;
  initialCategory?: string;
  initialOccasion?: string;
  initialCollection?: string;
  initialQuery?: string;
  initialSort?: string;
  categories: DemoCategory[];
}

export function CatalogClient({
  title,
  subtitle,
  initialMetal = "ALL",
  initialCategory = "all",
  initialOccasion = "",
  initialCollection = "",
  initialQuery = "",
  initialSort = "popularity",
  categories,
}: CatalogClientProps) {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [q, setQ] = useState(initialQuery);
  const [metal, setMetal] = useState(initialMetal);
  const [category, setCategory] = useState(initialCategory);
  const [purity, setPurity] = useState("ALL");
  const [occasion, setOccasion] = useState(initialOccasion);
  const [collection, setCollection] = useState(initialCollection);
  const [maxPrice, setMaxPrice] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState(initialSort);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (metal && metal !== "ALL") params.set("metal", metal);
      if (category && category !== "all") params.set("category", category);
      if (purity && purity !== "ALL") params.set("purity", purity);
      if (occasion) params.set("occasion", occasion);
      if (collection) params.set("collection", collection);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (maxWeight) params.set("maxWeight", maxWeight);
      if (inStock) params.set("inStock", "true");
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } finally {
      setLoading(false);
    }
  }, [
    q,
    metal,
    category,
    purity,
    occasion,
    collection,
    maxPrice,
    maxWeight,
    inStock,
    sort,
    page,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function resetFilters() {
    setQ("");
    setMetal(initialMetal);
    setCategory(initialCategory);
    setPurity("ALL");
    setOccasion("");
    setCollection("");
    setMaxPrice("");
    setMaxWeight("");
    setInStock(false);
    setPage(1);
  }

  const FilterPanel = (
    <div className="space-y-5 text-sm">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Search
        </label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6A6258]" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Name, SKU, metal..."
            className="w-full rounded-xl border border-[#EFE8DC] bg-white pl-9 pr-3 py-2 text-xs focus:border-[#C59B5F] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="mt-1.5 w-full rounded-xl border border-[#EFE8DC] bg-white px-3 py-2 text-xs"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Metal Type
        </label>
        <select
          value={metal}
          onChange={(e) => {
            setMetal(e.target.value);
            setPage(1);
          }}
          className="mt-1.5 w-full rounded-xl border border-[#EFE8DC] bg-white px-3 py-2 text-xs"
        >
          <option value="ALL">All Metals</option>
          <option value="GOLD">Gold</option>
          <option value="DIAMOND">Diamond</option>
          <option value="SILVER">Silver</option>
          <option value="PLATINUM">Platinum</option>
          <option value="BULLION">Bullion &amp; Coins</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Purity
        </label>
        <select
          value={purity}
          onChange={(e) => {
            setPurity(e.target.value);
            setPage(1);
          }}
          className="mt-1.5 w-full rounded-xl border border-[#EFE8DC] bg-white px-3 py-2 text-xs"
        >
          <option value="ALL">All Purities</option>
          <option value="24KT">24KT Gold</option>
          <option value="22KT">22KT Gold</option>
          <option value="18KT">18KT Gold</option>
          <option value="14KT">14KT Gold</option>
          <option value="925">925 Silver</option>
          <option value="999">999 Silver</option>
          <option value="950">950 Platinum</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Max Price (₹)
        </label>
        <select
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
          className="mt-1.5 w-full rounded-xl border border-[#EFE8DC] bg-white px-3 py-2 text-xs"
        >
          <option value="">Any Price</option>
          <option value="25000">Under ₹25,000</option>
          <option value="50000">Under ₹50,000</option>
          <option value="100000">Under ₹1,00,000</option>
          <option value="250000">Under ₹2,50,000</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#A67C42]">
          Max Net Weight (g)
        </label>
        <select
          value={maxWeight}
          onChange={(e) => {
            setMaxWeight(e.target.value);
            setPage(1);
          }}
          className="mt-1.5 w-full rounded-xl border border-[#EFE8DC] bg-white px-3 py-2 text-xs"
        >
          <option value="">Any Weight</option>
          <option value="5">Up to 5g</option>
          <option value="15">Up to 15g</option>
          <option value="30">Up to 30g</option>
          <option value="50">Up to 50g</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-xs text-[#221F1B]">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => {
            setInStock(e.target.checked);
            setPage(1);
          }}
          className="rounded border-[#C59B5F]"
        />
        In Stock Only
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-full border border-[#EFE8DC] py-2 text-xs font-medium text-[#6A6258] hover:border-[#C59B5F] hover:text-[#221F1B]"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-[70vh]">
      <div className="border-b border-[#EFE8DC] bg-[#FAF7F2] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Chintamani Jewellers Collection
          </p>
          <h1 className="mt-1 font-luxury text-4xl font-semibold text-[#221F1B]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6A6258]">{subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF7F2] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EFE8DC] px-4 py-2 text-xs font-medium text-[#221F1B] lg:hidden"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
            <span className="text-xs text-[#6A6258]">
              Showing {products.length} of {total} designs
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-full border border-[#EFE8DC] bg-white px-4 py-2 text-xs font-medium text-[#221F1B]"
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="best_sellers">Best Sellers</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <div className="hidden sm:flex items-center rounded-full border border-[#EFE8DC] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-full p-1.5 ${
                  viewMode === "grid"
                    ? "bg-[#221F1B] text-white"
                    : "text-[#6A6258]"
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-full p-1.5 ${
                  viewMode === "list"
                    ? "bg-[#221F1B] text-white"
                    : "text-[#6A6258]"
                }`}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/60 p-5 h-fit sticky top-28">
            <div className="flex items-center gap-2 font-luxury text-xl font-semibold text-[#221F1B] mb-4">
              <SlidersHorizontal className="h-4 w-4 text-[#A67C42]" />
              Refine Jewellery
            </div>
            {FilterPanel}
          </aside>

          <div className="lg:col-span-3 pb-16 lg:pb-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 sm:h-80 animate-pulse rounded-2xl bg-[#FAF7F2]"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2]/50 p-8 sm:p-12 text-center">
                <p className="font-luxury text-2xl text-[#221F1B]">
                  No jewellery matched your selected filters
                </p>
                <p className="mt-2 text-sm text-[#6A6258]">
                  Try clearing some filters or searching by metal or category.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-5"
                      : "space-y-3 sm:space-y-4"
                  }
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} viewMode={viewMode} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-full border border-[#EFE8DC] px-4 py-2 text-xs font-medium disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-[#6A6258]">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-full border border-[#EFE8DC] px-4 py-2 text-xs font-medium disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] h-full bg-white p-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3 mb-4">
              <span className="font-luxury text-xl font-semibold">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
