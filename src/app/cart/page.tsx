"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { formatINR } from "@/lib/pricing";

export default function CartPage() {
  const { cart, updateCartItem, removeCartItem, applyCoupon } = useStore();
  const [couponInput, setCouponInput] = useState("");

  return (
    <div className="bg-white py-10 min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
          Shopping Bag ({cart.itemCount})
        </h1>

        {cart.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#C59B5F]" />
            <p className="mt-3 font-luxury text-2xl text-[#221F1B]">
              Your shopping bag is currently empty
            </p>
            <Link
              href="/jewellery"
              className="mt-5 inline-block rounded-full bg-[#221F1B] px-7 py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              Browse Jewellery
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-[#EFE8DC] bg-white p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-28 w-28 rounded-xl object-cover border border-[#EFE8DC]"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-luxury text-xl font-semibold text-[#221F1B] hover:text-[#A67C42]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#6A6258] mt-0.5">
                          SKU: {item.sku} • {item.purity} • {item.netWeightGrams}g net
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="text-[#6A6258] hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <select
                          value={item.selectedSize}
                          onChange={(e) =>
                            updateCartItem(item.id, {
                              selectedSize: e.target.value,
                            })
                          }
                          className="rounded-lg border border-[#EFE8DC] bg-[#FAF7F2] px-3 py-1.5 text-xs"
                        >
                          {item.sizeOptions.map((s) => (
                            <option key={s} value={s}>
                              Size: {s}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center rounded-full border border-[#EFE8DC]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(item.id, {
                                quantity: item.quantity - 1,
                              })
                            }
                            className="p-1.5"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartItem(item.id, {
                                quantity: item.quantity + 1,
                              })
                            }
                            className="p-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-[#221F1B]">
                          {formatINR(item.lineTotal)}
                        </div>
                        <div className="text-[11px] text-[#6A6258]">
                          Incl. GST
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-6 h-fit space-y-4">
              <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                Order Summary
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon (e.g. FESTIVE5)"
                  className="flex-1 rounded-full border border-[#EFE8DC] bg-white px-4 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => applyCoupon(couponInput)}
                  className="rounded-full border border-[#C59B5F] bg-white px-4 py-2 text-xs font-semibold text-[#A67C42] hover:bg-[#C59B5F] hover:text-white"
                >
                  Apply
                </button>
              </div>
              {cart.couponError && (
                <p className="text-xs text-red-600">{cart.couponError}</p>
              )}
              {cart.appliedCoupon && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>{cart.appliedCoupon.code} applied</span>
                  <button
                    type="button"
                    onClick={() => applyCoupon(null)}
                    className="underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-2 text-sm border-t border-[#EFE8DC] pt-4">
                <div className="flex justify-between text-[#6A6258]">
                  <span>Subtotal (Metal + Making + Stones)</span>
                  <span>{formatINR(cart.subtotalBeforeGst)}</span>
                </div>
                <div className="flex justify-between text-[#6A6258]">
                  <span>GST (3%)</span>
                  <span>{formatINR(cart.gstTotal)}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(cart.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6A6258]">
                  <span>Insured Shipping</span>
                  <span>
                    {cart.shippingCharges === 0
                      ? "FREE"
                      : formatINR(cart.shippingCharges)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EFE8DC] pt-3 text-base font-bold text-[#221F1B]">
                  <span>Total Payable</span>
                  <span>{formatINR(cart.finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-full bg-[#221F1B] py-3.5 text-center text-sm font-semibold text-white hover:bg-[#A67C42]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
