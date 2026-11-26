"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "./StoreProvider";
import { formatINR } from "@/lib/pricing";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartItem,
    removeCartItem,
    applyCoupon,
  } = useStore();
  const [couponInput, setCouponInput] = useState("");

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={() => setCartOpen(false)}
      />
      <div className="relative z-10 flex h-full max-h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EFE8DC] bg-[#FAF7F2] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#A67C42]" />
            <h2 className="font-luxury text-xl font-semibold text-[#221F1B]">
              Your Jewellery Bag ({cart.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="rounded-full p-1.5 text-[#6A6258] hover:bg-white"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-[#C59B5F]/50 mb-3" />
              <p className="font-luxury text-xl text-[#221F1B]">
                Your jewellery bag is empty
              </p>
              <p className="mt-1 text-sm text-[#6A6258]">
                Explore our handcrafted gold, diamond, and silver collections.
              </p>
              <Link
                href="/jewellery"
                onClick={() => setCartOpen(false)}
                className="mt-5 rounded-full bg-[#221F1B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#A67C42]"
              >
                Explore Jewellery
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/50 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover border border-[#EFE8DC]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="text-sm font-semibold text-[#221F1B] hover:text-[#A67C42] line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      className="text-[#6A6258] hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#6A6258] mt-0.5">
                    {item.sku} • {item.purity} • {item.netWeightGrams}g
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <select
                      value={item.selectedSize}
                      onChange={(e) =>
                        updateCartItem(item.id, { selectedSize: e.target.value })
                      }
                      className="rounded-md border border-[#EFE8DC] bg-white px-2 py-1 text-xs text-[#221F1B]"
                    >
                      {item.sizeOptions.map((sz) => (
                        <option key={sz} value={sz}>
                          Size: {sz}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center rounded-full border border-[#EFE8DC] bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartItem(item.id, { quantity: item.quantity - 1 })
                        }
                        className="p-1 text-[#221F1B] hover:text-[#A67C42]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartItem(item.id, { quantity: item.quantity + 1 })
                        }
                        className="p-1 text-[#221F1B] hover:text-[#A67C42]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm font-semibold text-[#221F1B]">
                    {formatINR(item.lineTotal)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-[#EFE8DC] bg-[#FAF7F2] p-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code (e.g. FESTIVE5)"
                className="flex-1 rounded-full border border-[#EFE8DC] bg-white px-3.5 py-1.5 text-xs focus:border-[#C59B5F] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => applyCoupon(couponInput)}
                className="rounded-full border border-[#C59B5F] px-4 py-1.5 text-xs font-medium text-[#A67C42] hover:bg-[#C59B5F] hover:text-white"
              >
                Apply
              </button>
            </div>
            {cart.couponError && (
              <p className="text-xs text-red-600">{cart.couponError}</p>
            )}
            {cart.appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span>Coupon {cart.appliedCoupon.code} applied</span>
                <button
                  type="button"
                  onClick={() => applyCoupon(null)}
                  className="underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-1 text-xs text-[#6A6258]">
              <div className="flex justify-between">
                <span>Subtotal (incl. Making &amp; Stones)</span>
                <span>{formatINR(cart.subtotalBeforeGst)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (3%)</span>
                <span>{formatINR(cart.gstTotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-{formatINR(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span>
                  {cart.shippingCharges === 0
                    ? "FREE"
                    : formatINR(cart.shippingCharges)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EFE8DC] pt-2 text-sm font-semibold text-[#221F1B]">
                <span>Total</span>
                <span>{formatINR(cart.finalTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="rounded-full border border-[#221F1B] py-2.5 text-center text-xs font-semibold text-[#221F1B] hover:bg-white"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-[#221F1B] py-2.5 text-center text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
