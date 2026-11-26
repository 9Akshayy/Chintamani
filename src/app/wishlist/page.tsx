"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { formatINR } from "@/lib/pricing";
import type { EnrichedProduct } from "@/lib/store";

export default function WishlistPage() {
  const { user, addToCart, toggleWishlist } = useStore();
  const [items, setItems] = useState<EnrichedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWishlist() {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, [user?.wishlistProductIds.length]);

  return (
    <div className="bg-white py-12 min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
          My Wishlist
        </h1>

        {!user ? (
          <div className="mt-8 rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-[#C59B5F]" />
            <p className="mt-3 font-luxury text-2xl text-[#221F1B]">
              Sign in to view and sync your wishlist
            </p>
            <Link
              href="/account"
              className="mt-4 inline-block rounded-full bg-[#221F1B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              Sign In / Register
            </Link>
          </div>
        ) : loading ? (
          <p className="mt-6 text-sm text-[#6A6258]">Loading wishlist...</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-10 text-center">
            <p className="font-luxury text-2xl text-[#221F1B]">
              No saved jewellery pieces yet
            </p>
            <Link
              href="/jewellery"
              className="mt-4 inline-block rounded-full bg-[#221F1B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-[#EFE8DC] bg-white p-4 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/product/${p.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images[0]?.url || "/images/cat-gold-necklace.jpg"}
                      alt={p.name}
                      className="aspect-square w-full rounded-xl object-cover bg-[#FAF7F2]"
                    />
                  </Link>
                  <Link
                    href={`/product/${p.slug}`}
                    className="mt-3 block font-luxury text-lg font-semibold text-[#221F1B]"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-[#6A6258]">
                    {p.purity} • {p.netWeightGrams}g
                  </p>
                  <p className="mt-1 text-base font-bold text-[#221F1B]">
                    {formatINR(p.price.finalPrice)}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await addToCart(p.id, p.sizeOptions[0], 1, true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#221F1B] py-2 text-xs font-semibold text-white hover:bg-[#A67C42]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    className="rounded-full border border-[#EFE8DC] p-2 text-[#6A6258] hover:text-red-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
