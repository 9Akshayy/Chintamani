"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { formatINR } from "@/lib/pricing";
import type { DemoOrder, SiteSettingsConfig } from "@/lib/demo-data";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");
  const buyNowSize = searchParams.get("size") || undefined;

  const { cart, user, refreshCart, showToast } = useStore();
  const [settings, setSettings] = useState<SiteSettingsConfig | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Maharashtra");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "RAZORPAY" | "UPI" | "CARD" | "NET_BANKING" | "COD"
  >("RAZORPAY");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingVerification, setPendingVerification] = useState<{
    order: DemoOrder;
    mode: string;
    providerOrderId: string;
  } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
      setPhone((prev) => prev || user.phone);
    }
  }, [user]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          line1,
          line2,
          city,
          state: stateName,
          pinCode,
          country: "India",
          paymentMethod,
          couponCode: couponCode || cart.appliedCoupon?.code || null,
          directBuyProductId: buyNowId || undefined,
          directBuySize: buyNowSize,
          directBuyQuantity: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to create order.");
        return;
      }

      if (paymentMethod === "COD") {
        setConfirmedOrder(data.order);
        await refreshCart();
        return;
      }

      setPendingVerification({
        order: data.order,
        mode: data.payment.mode,
        providerOrderId: data.payment.providerOrderId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDemoPayment() {
    if (!pendingVerification) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: pendingVerification.order.id,
          providerOrderId: pendingVerification.providerOrderId,
          demoConfirm: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment verification failed.");
        return;
      }
      setConfirmedOrder(data.order);
      setPendingVerification(null);
      await refreshCart();
      showToast("Payment verified & order confirmed!");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="bg-white py-14">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-8 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Order Confirmed
            </p>
            <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
              Thank You, {confirmedOrder.customerName}
            </h1>
            <p className="text-sm text-[#6A6258]">
              Order Number:{" "}
              <span className="font-semibold text-[#221F1B]">
                {confirmedOrder.orderNumber}
              </span>{" "}
              • Invoice:{" "}
              <span className="font-semibold text-[#221F1B]">
                {confirmedOrder.invoiceNumber || "Generating"}
              </span>
            </p>

            <div className="rounded-2xl border border-[#EFE8DC] bg-white p-5 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6A6258]">Payment Status</span>
                <span className="font-semibold text-emerald-700">
                  {confirmedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6258]">Order Status</span>
                <span className="font-semibold text-[#221F1B]">
                  {confirmedOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6258]">Total Amount</span>
                <span className="font-bold text-[#221F1B]">
                  {formatINR(confirmedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/account"
                className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                View Order History
              </Link>
              <Link
                href="/jewellery"
                className="rounded-full border border-[#C59B5F] bg-white px-6 py-2.5 text-xs font-semibold text-[#221F1B]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <div className="bg-white py-14">
        <div className="mx-auto max-w-xl px-4">
          <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-8 space-y-5">
            <div className="flex items-center gap-2 text-[#A67C42]">
              <Lock className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Payment Verification ({pendingVerification.mode} Mode)
              </span>
            </div>
            <h1 className="font-luxury text-3xl font-semibold text-[#221F1B]">
              Complete Payment for {pendingVerification.order.orderNumber}
            </h1>
            <p className="text-sm text-[#6A6258]">
              Order total:{" "}
              <strong className="text-[#221F1B]">
                {formatINR(pendingVerification.order.totalAmount)}
              </strong>
              . Orders are never marked as paid without verified payment
              confirmation.
            </p>
            {pendingVerification.mode === "DEMO" && (
              <div className="rounded-2xl border border-[#C59B5F]/40 bg-white p-4 text-xs text-[#6A6258]">
                Razorpay Live API keys are not configured in this environment.
                Click below to simulate a verified Razorpay payment confirmation.
              </div>
            )}
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmDemoPayment}
              className="w-full rounded-full bg-[#221F1B] py-3.5 text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              {submitting
                ? "Verifying Payment..."
                : `Verify & Pay ${formatINR(pendingVerification.order.totalAmount)}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10 min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
          Secure Checkout
        </h1>
        <p className="mt-1 text-sm text-[#6A6258]">
          {user
            ? `Checking out as ${user.name} (${user.email})`
            : "Checking out as Guest — or sign in via My Account for saved addresses."}
        </p>

        {!buyNowId && cart.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-10 text-center">
            <p className="font-luxury text-2xl">Your cart is empty.</p>
            <Link
              href="/jewellery"
              className="mt-4 inline-block rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Shop Jewellery
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="mt-8 grid gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-[#EFE8DC] p-6 space-y-4">
                <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                  1. Customer &amp; Delivery Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name *"
                    className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number *"
                    className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address *"
                    className="sm:col-span-2 rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Delivery Address (House No, Street, Area) *"
                    className="sm:col-span-2 rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Landmark (Optional)"
                    className="sm:col-span-2 rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City *"
                    className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State *"
                    className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="6-Digit PIN Code *"
                    className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                  />
                  <input
                    readOnly
                    value="India"
                    className="rounded-xl border border-[#EFE8DC] bg-[#FAF7F2] px-4 py-2.5 text-sm text-[#6A6258]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#EFE8DC] p-6 space-y-4">
                <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                  2. Payment Method
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  {(
                    [
                      { id: "RAZORPAY", label: "Razorpay (All Methods)" },
                      { id: "UPI", label: "UPI (GPay / PhonePe / BHIM)" },
                      { id: "CARD", label: "Credit / Debit Card" },
                      { id: "NET_BANKING", label: "Net Banking" },
                    ] as const
                  ).map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-2.5 rounded-xl border p-3.5 cursor-pointer ${
                        paymentMethod === m.id
                          ? "border-[#C59B5F] bg-[#FAF7F2]"
                          : "border-[#EFE8DC]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                      />
                      <span className="font-medium">{m.label}</span>
                    </label>
                  ))}

                  {settings?.codEnabled && (
                    <label
                      className={`flex items-center gap-2.5 rounded-xl border p-3.5 cursor-pointer ${
                        paymentMethod === "COD"
                          ? "border-[#C59B5F] bg-[#FAF7F2]"
                          : "border-[#EFE8DC]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <span className="font-medium">Cash on Delivery (COD)</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-6 h-fit space-y-4">
              <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                Order Summary
              </h2>

              {!buyNowId && (
                <div className="space-y-2 text-xs">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-2">
                      <span className="text-[#221F1B]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatINR(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                  <hr className="border-[#EFE8DC] my-2" />
                  <div className="flex justify-between text-[#6A6258]">
                    <span>GST (3%)</span>
                    <span>{formatINR(cart.gstTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6A6258]">
                    <span>Shipping</span>
                    <span>
                      {cart.shippingCharges === 0
                        ? "FREE"
                        : formatINR(cart.shippingCharges)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#221F1B] pt-2 border-t border-[#EFE8DC]">
                    <span>Total</span>
                    <span>{formatINR(cart.finalTotal)}</span>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code (Optional)"
                className="w-full rounded-full border border-[#EFE8DC] bg-white px-4 py-2 text-xs"
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#221F1B] py-3.5 text-sm font-semibold text-white hover:bg-[#A67C42] disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />
                {submitting ? "Processing..." : "Place Order & Proceed"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
