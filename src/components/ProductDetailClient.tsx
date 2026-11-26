"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Heart,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { formatINR } from "@/lib/pricing";
import type { DemoReview, SiteSettingsConfig } from "@/lib/demo-data";
import type { EnrichedProduct } from "@/lib/store";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: EnrichedProduct;
  related: EnrichedProduct[];
  reviews: DemoReview[];
  settings: SiteSettingsConfig;
}

export function ProductDetailClient({
  product,
  related,
  reviews,
  settings,
}: ProductDetailClientProps) {
  const { user, addToCart, toggleWishlist, showToast } = useStore();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(
    product.images[0]?.url || "/images/cat-gold-necklace.jpg"
  );
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions[0] || "Standard"
  );
  const [recentlyViewed, setRecentlyViewed] = useState<EnrichedProduct[]>([]);

  const [revName, setRevName] = useState(user?.name || "");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);

  const isWishlisted = user?.wishlistProductIds.includes(product.id) ?? false;

  useEffect(() => {
    try {
      const key = "chintamani_recently_viewed";
      const raw = localStorage.getItem(key);
      const list: EnrichedProduct[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((p) => p.id !== product.id);
      setRecentlyViewed(filtered.slice(0, 4));
      const updated = [product, ...filtered].slice(0, 6);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // ignore localStorage errors
    }
  }, [product]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  async function handleBuyNow() {
    router.push(
      `/checkout?buyNow=${encodeURIComponent(
        product.id
      )}&size=${encodeURIComponent(selectedSize)}`
    );
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setRevSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: revName || "Guest Patron",
          rating: revRating,
          comment: revComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        setRevComment("");
      } else {
        showToast(data.error || "Unable to submit review");
      }
    } finally {
      setRevSubmitting(false);
    }
  }

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/product/${product.slug}`;
  const waHref = `https://wa.me/${
    settings.whatsappNumber
  }?text=${encodeURIComponent(
    `Hello ${settings.businessName}, I am interested in ${product.name} (SKU: ${product.sku}).\nProduct link: ${pageUrl}`
  )}`;

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-[#6A6258] flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#A67C42]">
            Home
          </Link>
          <span>/</span>
          <Link href="/jewellery" className="hover:text-[#A67C42]">
            Jewellery
          </Link>
          <span>/</span>
          <Link
            href={`/jewellery?category=${product.categorySlug}`}
            className="hover:text-[#A67C42]"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-[#221F1B] font-medium">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Gallery with Zoom */}
          <div className="space-y-4">
            <div
              onClick={() => setZoomed((z) => !z)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomed(false)}
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                style={{ transformOrigin: zoomOrigin }}
                className={`h-full w-full object-cover transition-transform duration-300 ${
                  zoomed ? "scale-175" : "scale-100"
                }`}
              />
              {product.isDemo && (
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#6A6258] border border-[#EFE8DC]">
                  Demonstration Sample
                </span>
              )}
              <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[11px] text-[#6A6258]">
                Click image to {zoomed ? "reset" : "zoom"}
              </span>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                      activeImage === img.url
                        ? "border-[#C59B5F]"
                        : "border-[#EFE8DC]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Transparent Pricing */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
                {product.metalType} • {product.purity} • SKU: {product.sku}
              </p>
              <h1 className="mt-1.5 font-luxury text-3xl sm:text-4xl font-semibold text-[#221F1B]">
                {product.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#6A6258]">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline gap-3 border-y border-[#EFE8DC] py-4">
              <div className="text-3xl font-bold text-[#221F1B]">
                {formatINR(product.price.finalPrice)}
              </div>
              <span className="text-xs text-[#6A6258]">
                (Inclusive of {product.gstPercent}% GST)
              </span>
            </div>

            {/* Transparent Price Breakdown */}
            <div className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-5">
              <h2 className="font-luxury text-xl font-semibold text-[#221F1B] mb-3">
                Transparent Price Breakdown
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6A6258]">
                  <span>
                    Metal Value ({product.netWeightGrams}g ×{" "}
                    {formatINR(product.price.ratePerGram)}/g)
                  </span>
                  <span className="font-medium text-[#221F1B]">
                    {formatINR(product.price.metalValue)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6A6258]">
                  <span>
                    Making Charges (
                    {product.makingChargeType === "PERCENTAGE"
                      ? `${product.makingChargeValue}%`
                      : product.makingChargeType === "PER_GRAM"
                        ? `${formatINR(product.makingChargeValue)}/g`
                        : "Fixed"}
                    )
                  </span>
                  <span className="font-medium text-[#221F1B]">
                    {formatINR(product.price.makingCharges)}
                  </span>
                </div>
                {product.price.stoneCharges > 0 && (
                  <div className="flex justify-between text-[#6A6258]">
                    <span>Stone / Diamond Charges</span>
                    <span className="font-medium text-[#221F1B]">
                      {formatINR(product.price.stoneCharges)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#6A6258]">
                  <span>GST ({product.gstPercent}%)</span>
                  <span className="font-medium text-[#221F1B]">
                    {formatINR(product.price.gstAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EFE8DC] pt-2 text-base font-bold text-[#221F1B]">
                  <span>Final Price</span>
                  <span>{formatINR(product.price.finalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Size Options */}
            {product.sizeOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#221F1B]">
                    Select Size
                  </span>
                  <Link
                    href="/guides/ring-size"
                    className="text-[#A67C42] underline"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                        selectedSize === sz
                          ? "border-[#221F1B] bg-[#221F1B] text-white"
                          : "border-[#EFE8DC] bg-white text-[#221F1B] hover:border-[#C59B5F]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability & Delivery */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl border border-[#EFE8DC] p-3">
                <CheckCircle2
                  className={`h-4 w-4 ${
                    product.stockQuantity > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                />
                <span>
                  {product.stockQuantity > 0
                    ? `In Stock (${product.stockQuantity} available)`
                    : "Made to Order / Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#EFE8DC] p-3">
                <Truck className="h-4 w-4 text-[#A67C42]" />
                <span>
                  Estimated Delivery: {product.estimatedDeliveryDays}–
                  {product.estimatedDeliveryDays + 2} business days
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={product.stockQuantity < 1}
                  onClick={() => addToCart(product.id, selectedSize, 1, true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#221F1B] py-3.5 text-sm font-semibold text-white hover:bg-[#A67C42] disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={product.stockQuantity < 1}
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C59B5F] py-3.5 text-sm font-semibold text-white hover:bg-[#A67C42] disabled:opacity-40"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EFE8DC] py-2.5 text-xs font-semibold text-[#221F1B] hover:border-[#C59B5F]"
                >
                  <Heart
                    className="h-4 w-4 text-[#A67C42]"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                  {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>
              </div>
            </div>

            {/* Specifications & Care */}
            <div className="rounded-2xl border border-[#EFE8DC] p-5 space-y-4">
              <h2 className="font-luxury text-xl font-semibold text-[#221F1B]">
                Product Specifications
              </h2>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-[#6A6258]">Metal Type</span>
                <span className="font-medium text-[#221F1B]">{product.metalType}</span>
                <span className="text-[#6A6258]">Purity</span>
                <span className="font-medium text-[#221F1B]">{product.purity}</span>
                {product.diamondQuality && (
                  <>
                    <span className="text-[#6A6258]">Diamond Quality</span>
                    <span className="font-medium text-[#221F1B]">
                      {product.diamondQuality}
                    </span>
                  </>
                )}
                <span className="text-[#6A6258]">Gross Weight</span>
                <span className="font-medium text-[#221F1B]">
                  {product.grossWeightGrams} g
                </span>
                <span className="text-[#6A6258]">Net Weight</span>
                <span className="font-medium text-[#221F1B]">
                  {product.netWeightGrams} g
                </span>
                <span className="text-[#6A6258]">Stone Weight</span>
                <span className="font-medium text-[#221F1B]">
                  {product.stoneWeightGrams} g
                </span>
                <span className="text-[#6A6258]">HSN Code</span>
                <span className="font-medium text-[#221F1B]">{product.hsnCode}</span>
              </div>

              <div className="border-t border-[#FAF7F2] pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#221F1B]">
                  <ShieldCheck className="h-4 w-4 text-[#A67C42]" />
                  Jewellery Care Information
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#6A6258]">
                  {product.careInstructions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <section className="mt-16 border-t border-[#EFE8DC] pt-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-luxury text-3xl font-semibold text-[#221F1B]">
                Customer Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-[#6A6258]">
                  No reviews yet for this piece. Be the first to share your experience.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/50 p-4"
                    >
                      <div className="flex items-center gap-1 text-[#C59B5F]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-[#221F1B]">{rev.comment}</p>
                      <p className="mt-2 text-xs font-semibold text-[#6A6258]">
                        {rev.customerName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={submitReview}
              className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-6 space-y-4 h-fit"
            >
              <h3 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                Write a Review
              </h3>
              <input
                type="text"
                required
                value={revName}
                onChange={(e) => setRevName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full rounded-xl border border-[#EFE8DC] bg-white px-4 py-2.5 text-sm"
              />
              <select
                value={revRating}
                onChange={(e) => setRevRating(Number(e.target.value))}
                className="w-full rounded-xl border border-[#EFE8DC] bg-white px-4 py-2.5 text-sm"
              >
                <option value={5}>5 Stars — Exceptional</option>
                <option value={4}>4 Stars — Very Good</option>
                <option value={3}>3 Stars — Good</option>
                <option value={2}>2 Stars — Fair</option>
                <option value={1}>1 Star — Needs Improvement</option>
              </select>
              <textarea
                required
                rows={3}
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Share your thoughts on craftsmanship, finish, and service..."
                className="w-full rounded-xl border border-[#EFE8DC] bg-white px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={revSubmitting}
                className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                {revSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[#EFE8DC] pt-12">
            <h2 className="font-luxury text-3xl font-semibold text-[#221F1B] mb-6">
              You May Also Love
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 border-t border-[#EFE8DC] pt-12">
            <h2 className="font-luxury text-3xl font-semibold text-[#221F1B] mb-6">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Sticky Mobile Bottom Add-to-Cart Bar */}
        <div className="fixed bottom-14 left-0 right-0 z-30 block lg:hidden border-t border-[#EFE8DC] bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#221F1B] truncate">
                {formatINR(product.price.finalPrice)}
              </div>
              <div className="text-[10px] text-[#6A6258] truncate">
                {product.purity} • {selectedSize}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={product.stockQuantity < 1}
                onClick={() => addToCart(product.id, selectedSize, 1, true)}
                className="rounded-full border border-[#221F1B] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#221F1B] active:scale-95 transition disabled:opacity-40"
              >
                Add to Cart
              </button>
              <button
                type="button"
                disabled={product.stockQuantity < 1}
                onClick={handleBuyNow}
                className="rounded-full bg-[#221F1B] px-4 py-1.5 text-xs font-semibold text-white active:scale-95 transition disabled:opacity-40 hover:bg-[#A67C42]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
