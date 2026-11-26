"use client";

import React from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatINR } from "@/lib/pricing";
import type { EnrichedProduct } from "@/lib/store";
import { useStore } from "./StoreProvider";

export function ProductCard({
  product,
  viewMode = "grid",
}: {
  product: EnrichedProduct;
  viewMode?: "grid" | "list";
}) {
  const { user, addToCart, toggleWishlist, setQuickViewProduct } = useStore();
  const isWishlisted = user?.wishlistProductIds.includes(product.id) ?? false;
  const imgUrl = product.images[0]?.url || "/images/cat-gold-necklace.jpg";

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-[#EFE8DC] bg-white p-3.5 sm:p-4 transition-shadow hover:shadow-md">
        <Link
          href={`/product/${product.slug}`}
          className="relative h-44 sm:h-52 w-full sm:w-52 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.isDemo && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium text-[#6A6258] border border-[#EFE8DC]">
              Demo
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A67C42]">
                  {product.metalType} • {product.purity} • {product.sku}
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="font-luxury text-lg sm:text-2xl font-semibold text-[#221F1B] hover:text-[#A67C42]"
                >
                  {product.name}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`rounded-full p-2 border shrink-0 ${
                  isWishlisted
                    ? "border-[#C59B5F] bg-[#FAF7F2] text-[#A67C42]"
                    : "border-[#EFE8DC] text-[#6A6258] hover:text-[#A67C42]"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  className="h-4 w-4"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#6A6258] line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] sm:text-xs text-[#6A6258]">
              <span>Net: {product.netWeightGrams}g</span>
              <span>•</span>
              <span>Gross: {product.grossWeightGrams}g</span>
              {product.stockQuantity > 0 ? (
                <span className="text-emerald-700">• In Stock</span>
              ) : (
                <span className="text-red-600">• Out of Stock</span>
              )}
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#FAF7F2] pt-3">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#221F1B]">
                {formatINR(product.price.finalPrice)}
              </div>
              <div className="text-[10px] text-[#6A6258]">
                Incl. {product.gstPercent}% GST &amp; making
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuickViewProduct(product)}
                className="rounded-full border border-[#EFE8DC] px-3 sm:px-4 py-1.5 text-xs font-medium text-[#221F1B] hover:border-[#C59B5F]"
              >
                Quick View
              </button>
              <button
                type="button"
                disabled={product.stockQuantity < 1}
                onClick={() => addToCart(product.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#221F1B] px-4 sm:px-5 py-1.5 text-xs font-medium text-white hover:bg-[#A67C42] disabled:opacity-40"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#EFE8DC] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2]">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="rounded-full bg-[#221F1B]/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-[#FAF7F2]">
              Best Seller
            </span>
          )}
          {product.isDemo && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-[#6A6258] border border-[#EFE8DC]">
              Demo
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="absolute right-2 top-2 flex flex-col gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`rounded-full p-1.5 sm:p-2 shadow-sm transition-colors ${
              isWishlisted
                ? "bg-[#C59B5F] text-white"
                : "bg-white/90 text-[#221F1B] hover:bg-[#C59B5F] hover:text-white"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="rounded-full bg-white/90 p-1.5 sm:p-2 text-[#221F1B] shadow-sm hover:bg-[#221F1B] hover:text-white"
            aria-label="Quick view"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-wider text-[#A67C42]">
            <span className="truncate">
              {product.metalType} • {product.purity}
            </span>
            <span className="text-[#6A6258] ml-1 shrink-0">{product.sku}</span>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="mt-1 block font-luxury text-sm sm:text-base font-semibold text-[#221F1B] hover:text-[#A67C42] line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-[11px] text-[#6A6258]">
            {product.netWeightGrams}g net
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-[#FAF7F2] pt-2.5">
          <div>
            <div className="text-xs sm:text-sm font-bold text-[#221F1B] truncate">
              {formatINR(product.price.finalPrice)}
            </div>
            <div className="text-[9px] text-[#6A6258]">Incl. GST</div>
          </div>
          <button
            type="button"
            disabled={product.stockQuantity < 1}
            onClick={() => addToCart(product.id)}
            className="inline-flex items-center gap-1 rounded-full bg-[#221F1B] px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-white transition-colors hover:bg-[#A67C42] disabled:opacity-40 shrink-0"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
