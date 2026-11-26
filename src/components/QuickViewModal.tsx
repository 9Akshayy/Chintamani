"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, X } from "lucide-react";
import { formatINR } from "@/lib/pricing";
import { useStore } from "./StoreProvider";

export function QuickViewModal({ whatsappNumber }: { whatsappNumber: string }) {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!quickViewProduct) return null;

  const size = selectedSize || quickViewProduct.sizeOptions[0] || "Standard";
  const imgUrl =
    quickViewProduct.images[0]?.url || "/images/cat-gold-necklace.jpg";
  const waMessage = encodeURIComponent(
    `Hello Chintamani Jewellers, I would like to enquire about ${quickViewProduct.name} (SKU: ${quickViewProduct.sku}).`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={() => setQuickViewProduct(null)}
      />
      <div className="relative z-10 grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1.5 text-[#221F1B] shadow"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-[#FAF7F2] aspect-square md:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={quickViewProduct.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A67C42]">
              {quickViewProduct.metalType} • {quickViewProduct.purity} •{" "}
              {quickViewProduct.sku}
            </p>
            <h3 className="mt-1 font-luxury text-2xl font-semibold text-[#221F1B]">
              {quickViewProduct.name}
            </h3>
            <p className="mt-2 text-sm text-[#6A6258]">
              {quickViewProduct.shortDescription}
            </p>

            <div className="mt-4 rounded-2xl bg-[#FAF7F2] p-3.5 text-xs space-y-1.5">
              <div className="font-semibold text-[#221F1B] mb-1">
                Transparent Price Breakdown
              </div>
              <div className="flex justify-between text-[#6A6258]">
                <span>
                  Metal Value ({quickViewProduct.netWeightGrams}g ×{" "}
                  {formatINR(quickViewProduct.price.ratePerGram)}/g)
                </span>
                <span>{formatINR(quickViewProduct.price.metalValue)}</span>
              </div>
              <div className="flex justify-between text-[#6A6258]">
                <span>Making Charges</span>
                <span>{formatINR(quickViewProduct.price.makingCharges)}</span>
              </div>
              {quickViewProduct.price.stoneCharges > 0 && (
                <div className="flex justify-between text-[#6A6258]">
                  <span>Stone Charges</span>
                  <span>{formatINR(quickViewProduct.price.stoneCharges)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6A6258]">
                <span>GST ({quickViewProduct.gstPercent}%)</span>
                <span>{formatINR(quickViewProduct.price.gstAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-[#EFE8DC] pt-1.5 text-sm font-semibold text-[#221F1B]">
                <span>Final Price</span>
                <span>{formatINR(quickViewProduct.price.finalPrice)}</span>
              </div>
            </div>

            {quickViewProduct.sizeOptions.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-medium text-[#221F1B]">
                  Select Size
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {quickViewProduct.sizeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedSize(opt)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        size === opt
                          ? "border-[#221F1B] bg-[#221F1B] text-white"
                          : "border-[#EFE8DC] text-[#221F1B] hover:border-[#C59B5F]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={async () => {
                await addToCart(quickViewProduct.id, size, 1, true);
                setQuickViewProduct(null);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#221F1B] py-2.5 text-sm font-medium text-white hover:bg-[#A67C42]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="rounded-full border border-[#EFE8DC] py-2 text-center text-xs font-medium text-[#221F1B] hover:border-[#C59B5F]"
              >
                Full Details
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
