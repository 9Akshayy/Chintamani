"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Package, RotateCcw, User as UserIcon } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { formatINR } from "@/lib/pricing";
import type { DemoAddress, DemoOrder, DemoReturnRequest } from "@/lib/demo-data";

export default function AccountPage() {
  const { user, refreshUser, showToast } = useStore();
  const [authTab, setAuthTab] = useState<"login" | "register" | "forgot">(
    "login"
  );
  const [dashTab, setDashTab] = useState<
    "orders" | "profile" | "addresses" | "returns"
  >("orders");

  // Auth form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [authErr, setAuthErr] = useState<string | null>(null);

  // Dashboard data
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [addresses, setAddresses] = useState<DemoAddress[]>([]);
  const [returns, setReturns] = useState<DemoReturnRequest[]>([]);

  // Address form
  const [addrLine1, setAddrLine1] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("Maharashtra");
  const [addrPin, setAddrPin] = useState("");

  // Password form
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const loadAccountData = useCallback(async () => {
    if (!user) return;
    const [meRes, ordRes, retRes] = await Promise.all([
      fetch("/api/auth/me", { cache: "no-store" }),
      fetch("/api/orders", { cache: "no-store" }),
      fetch("/api/returns", { cache: "no-store" }),
    ]);
    if (meRes.ok) {
      const meData = await meRes.json();
      setAddresses(meData.user?.addresses || []);
    }
    if (ordRes.ok) {
      const ordData = await ordRes.json();
      setOrders(ordData.orders || []);
    }
    if (retRes.ok) {
      const retData = await retRes.json();
      setReturns(retData.returns || []);
    }
  }, [user]);

  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthErr(data.error || "Sign in failed");
      return;
    }
    await refreshUser();
    showToast(`Welcome back, ${data.user.name}`);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthErr(data.error || "Registration failed");
      return;
    }
    await refreshUser();
    showToast("Account created successfully");
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr(null);
    setAuthMsg(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) setAuthMsg(data.message);
    else setAuthErr(data.error);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshUser();
    showToast("Signed out");
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_address",
        line1: addrLine1,
        city: addrCity,
        state: addrState,
        pinCode: addrPin,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses || []);
      setAddrLine1("");
      setAddrCity("");
      setAddrPin("");
      showToast("Address saved");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "change_password",
        currentPassword: currPass,
        newPassword: newPass,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCurrPass("");
      setNewPass("");
      showToast("Password updated");
    } else {
      showToast(data.error || "Failed to update password");
    }
  }

  async function handleRequestReturn(orderId: string) {
    const res = await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        reason: "Size Exchange / Quality Inspection",
        details: "Requested via Customer Dashboard",
      }),
    });
    if (res.ok) {
      showToast("Return request submitted");
      await loadAccountData();
    }
  }

  if (!user) {
    return (
      <div className="bg-[#FAF7F2]/50 py-14 min-h-[75vh]">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-3xl border border-[#EFE8DC] bg-white p-7 shadow-sm">
            <div className="flex border-b border-[#EFE8DC] mb-6 text-sm font-medium">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`flex-1 pb-3 ${
                  authTab === "login"
                    ? "border-b-2 border-[#C59B5F] text-[#221F1B]"
                    : "text-[#6A6258]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("register")}
                className={`flex-1 pb-3 ${
                  authTab === "register"
                    ? "border-b-2 border-[#C59B5F] text-[#221F1B]"
                    : "text-[#6A6258]"
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("forgot")}
                className={`flex-1 pb-3 ${
                  authTab === "forgot"
                    ? "border-b-2 border-[#C59B5F] text-[#221F1B]"
                    : "text-[#6A6258]"
                }`}
              >
                Reset
              </button>
            </div>

            {authErr && (
              <p className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                {authErr}
              </p>
            )}
            {authMsg && (
              <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                {authMsg}
              </p>
            )}

            {authTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#221F1B] py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
                >
                  Sign In
                </button>
                <div className="rounded-xl bg-[#FAF7F2] p-3 text-[11px] text-[#6A6258]">
                  Demo Customer: <code>customer@example.com</code> /{" "}
                  <code>Customer@2026!</code>
                </div>
              </form>
            )}

            {authTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile Number"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#221F1B] py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
                >
                  Create Account
                </button>
              </form>
            )}

            {authTab === "forgot" && (
              <form onSubmit={handleForgot} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Registered Email Address"
                  className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#221F1B] py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
                >
                  Send Reset Instructions
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10 min-h-[75vh]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFE8DC] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF7F2] border border-[#C59B5F]/40 text-[#A67C42]">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-luxury text-3xl font-semibold text-[#221F1B]">
                {user.name}
              </h1>
              <p className="text-xs text-[#6A6258]">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                className="rounded-full bg-[#C59B5F] px-5 py-2 text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                Open Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EFE8DC] px-4 py-2 text-xs font-medium text-[#221F1B] hover:border-[#C59B5F]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              { id: "orders", label: "Order History & Tracking" },
              { id: "addresses", label: "Saved Addresses" },
              { id: "returns", label: "Return Requests" },
              { id: "profile", label: "Profile & Security" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDashTab(t.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold ${
                dashTab === t.id
                  ? "bg-[#221F1B] text-white"
                  : "bg-[#FAF7F2] text-[#6A6258] hover:text-[#221F1B]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {dashTab === "orders" && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-[#6A6258]">No orders placed yet.</p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-[#EFE8DC] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF7F2] pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#A67C42]" />
                      <span className="font-semibold text-sm">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#6A6258]">
                        • {new Date(ord.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-[#FAF7F2] px-3 py-1 font-medium text-[#221F1B]">
                        {ord.status}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                        {ord.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#6A6258] space-y-1">
                    {ord.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.productName} ({item.selectedSize}) × {item.quantity}
                        </span>
                        <span className="font-medium text-[#221F1B]">
                          {formatINR(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#FAF7F2] text-xs">
                    <div>
                      {ord.awbNumber && (
                        <span className="text-[#6A6258]">
                          Courier: {ord.courierName} • AWB: {ord.awbNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {ord.status === "DELIVERED" && (
                        <button
                          type="button"
                          onClick={() => handleRequestReturn(ord.id)}
                          className="inline-flex items-center gap-1 text-[#A67C42] hover:underline"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Request Return / Exchange
                        </button>
                      )}
                      <span className="font-bold text-sm text-[#221F1B]">
                        Total: {formatINR(ord.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {dashTab === "addresses" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-[#EFE8DC] p-4 text-sm"
                >
                  <div className="font-semibold">{a.label} — {a.fullName}</div>
                  <p className="text-xs text-[#6A6258] mt-1">
                    {a.line1}, {a.city}, {a.state} - {a.pinCode}
                  </p>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleAddAddress}
              className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-5 space-y-3 h-fit"
            >
              <h3 className="font-luxury text-xl font-semibold">
                Add New Address
              </h3>
              <input
                required
                value={addrLine1}
                onChange={(e) => setAddrLine1(e.target.value)}
                placeholder="Street Address"
                className="w-full rounded-xl border border-[#EFE8DC] bg-white px-3.5 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  placeholder="City"
                  className="rounded-xl border border-[#EFE8DC] bg-white px-3.5 py-2 text-sm"
                />
                <input
                  required
                  value={addrPin}
                  onChange={(e) => setAddrPin(e.target.value)}
                  placeholder="PIN Code"
                  className="rounded-xl border border-[#EFE8DC] bg-white px-3.5 py-2 text-sm"
                />
              </div>
              <input
                required
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
                placeholder="State"
                className="w-full rounded-xl border border-[#EFE8DC] bg-white px-3.5 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-5 py-2 text-xs font-semibold text-white"
              >
                Save Address
              </button>
            </form>
          </div>
        )}

        {dashTab === "returns" && (
          <div className="mt-6 space-y-3">
            {returns.length === 0 ? (
              <p className="text-sm text-[#6A6258]">No return requests found.</p>
            ) : (
              returns.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-[#EFE8DC] p-4 flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="font-semibold">{r.orderNumber}</div>
                    <div className="text-xs text-[#6A6258]">{r.reason}</div>
                  </div>
                  <span className="rounded-full bg-[#FAF7F2] px-3 py-1 text-xs font-medium">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {dashTab === "profile" && (
          <form
            onSubmit={handleChangePassword}
            className="mt-6 max-w-md rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-6 space-y-4"
          >
            <h3 className="font-luxury text-2xl font-semibold">
              Change Password
            </h3>
            <input
              type="password"
              required
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="Current Password"
              className="w-full rounded-xl border border-[#EFE8DC] bg-white px-4 py-2.5 text-sm"
            />
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New Password"
              className="w-full rounded-xl border border-[#EFE8DC] bg-white px-4 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
