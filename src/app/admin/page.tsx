"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { formatINR } from "@/lib/pricing";
import type {
  DemoBanner,
  DemoCategory,
  DemoCoupon,
  DemoMetalRate,
  DemoMetalRateHistory,
  DemoOrder,
  DemoReview,
  SiteSettingsConfig,
} from "@/lib/demo-data";
import type { EnrichedProduct } from "@/lib/store";

interface AdminOverviewData {
  metrics: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  monthlySales: { month: string; revenue: number }[];
  recentOrders: DemoOrder[];
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    orderCount: number;
    totalSpent: number;
  }[];
  products: EnrichedProduct[];
  categories: DemoCategory[];
  metalRates: DemoMetalRate[];
  metalRateHistory: DemoMetalRateHistory[];
  banners: DemoBanner[];
  coupons: DemoCoupon[];
  reviews: DemoReview[];
  settings: SiteSettingsConfig;
}

type AdminTab =
  | "dashboard"
  | "rates"
  | "products"
  | "orders"
  | "categories"
  | "banners"
  | "coupons"
  | "reviews"
  | "customers"
  | "settings"
  | "reports";

export default function AdminPage() {
  const { user, refreshUser, showToast } = useStore();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Rate editor state
  const [rateInputs, setRateInputs] = useState<Record<string, number>>({});

  // New Product form
  const [prodName, setProdName] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodCatId, setProdCatId] = useState("");
  const [prodMetal, setProdMetal] = useState("GOLD");
  const [prodPurity, setProdPurity] = useState("22KT");
  const [prodWeight, setProdWeight] = useState("10");
  const [prodMaking, setProdMaking] = useState("12");
  const [prodStock, setProdStock] = useState("5");

  // New Coupon form
  const [coupCode, setCoupCode] = useState("");
  const [coupType, setCoupType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [coupVal, setCoupVal] = useState("5");
  const [coupMin, setCoupMin] = useState("25000");

  // New Category form
  const [catName, setCatName] = useState("");

  // New Banner form
  const [banHeadline, setBanHeadline] = useState("");
  const [banCtaLink, setBanCtaLink] = useState("/jewellery");

  // Settings form
  const [settingsDraft, setSettingsDraft] = useState<SiteSettingsConfig | null>(
    null
  );

  const isAdmin =
    user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");

  const loadOverview = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as AdminOverviewData;
        setData(json);
        const rMap: Record<string, number> = {};
        for (const r of json.metalRates) rMap[r.metalKey] = r.ratePerGram;
        setRateInputs(rMap);
        setSettingsDraft(json.settings);
        if (!prodCatId && json.categories[0]) {
          setProdCatId(json.categories[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, prodCatId]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const json = await res.json();
    if (!res.ok) {
      setLoginError(json.error || "Invalid credentials");
      return;
    }
    if (json.user.role !== "ADMIN" && json.user.role !== "SUPER_ADMIN") {
      setLoginError("This account does not have Administrator privileges.");
      return;
    }
    await refreshUser();
    showToast("Signed in to Admin Portal");
  }

  async function handleSaveRates(e: React.FormEvent) {
    e.preventDefault();
    const payload = Object.entries(rateInputs).map(([metalKey, ratePerGram]) => ({
      metalKey,
      ratePerGram: Number(ratePerGram),
    }));
    const res = await fetch("/api/rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rates: payload,
        note: "Updated via Admin Dashboard",
        isDemo: false,
      }),
    });
    if (res.ok) {
      showToast("Metal rates updated & product prices recalculated!");
      await loadOverview();
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: prodName,
        sku: prodSku,
        categoryId: prodCatId,
        metalType: prodMetal,
        purity: prodPurity,
        grossWeightGrams: Number(prodWeight),
        netWeightGrams: Number(prodWeight),
        makingChargeValue: Number(prodMaking),
        stockQuantity: Number(prodStock),
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setProdName("");
      setProdSku("");
      showToast("Product added to catalogue");
      await loadOverview();
    } else {
      showToast(json.error || "Failed to add product");
    }
  }

  async function handleDeleteProduct(id: string) {
    await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    showToast("Product removed");
    await loadOverview();
  }

  async function handleToggleProductFlag(
    id: string,
    field: "isPublished" | "isBestSeller" | "isFeatured",
    val: boolean
  ) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: val }),
    });
    await loadOverview();
  }

  async function handleUpdateOrderStatus(orderId: string, status: string) {
    const awbNumber =
      status === "SHIPPED"
        ? `BD-${Math.floor(10000000 + Math.random() * 90000000)}`
        : undefined;
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status,
        awbNumber,
        courierName: status === "SHIPPED" ? "BlueDart Insured" : undefined,
      }),
    });
    showToast(`Order marked ${status}`);
    await loadOverview();
  }

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: coupCode,
        discountType: coupType,
        discountValue: Number(coupVal),
        minOrderValue: Number(coupMin),
      }),
    });
    setCoupCode("");
    showToast("Coupon created");
    await loadOverview();
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName }),
    });
    setCatName("");
    showToast("Category created");
    await loadOverview();
  }

  async function handleCreateBanner(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: banHeadline,
        headline: banHeadline,
        ctaLink: banCtaLink,
      }),
    });
    setBanHeadline("");
    showToast("Promotional banner added");
    await loadOverview();
  }

  async function handleReviewAction(
    id: string,
    status: "APPROVED" | "REJECTED",
    isFeaturedTestimonial?: boolean
  ) {
    await fetch("/api/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, isFeaturedTestimonial }),
    });
    showToast("Review updated");
    await loadOverview();
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settingsDraft) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsDraft),
    });
    if (res.ok) {
      showToast("Store settings saved");
      await loadOverview();
    }
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#FAF7F2] py-16 min-h-[75vh]">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-3xl border border-[#EFE8DC] bg-white p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-[#A67C42]">
              <Lock className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Protected Admin Portal
              </span>
            </div>
            <h1 className="font-luxury text-3xl font-semibold text-[#221F1B]">
              Administrator Sign In
            </h1>
            {loginError && (
              <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
                {loginError}
              </p>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
              />
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[#221F1B] py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
              >
                Sign In to Admin Panel
              </button>
            </form>
            <div className="rounded-xl bg-[#FAF7F2] p-3 text-[11px] text-[#6A6258]">
              Default Admin: <code>admin@chintamanijewellers.in</code> /{" "}
              <code>ChangeMe@2026!</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="p-16 text-center text-sm text-[#6A6258]">
        Loading Admin Dashboard...
      </div>
    );
  }

  const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "rates", label: "Metal Rates", icon: Sparkles },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "banners", label: "Banners", icon: RefreshCw },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "reports", label: "Reports", icon: Download },
  ];

  return (
    <div className="bg-[#FAF7F2]/40 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
              Chintamani Jewellers Management
            </p>
            <h1 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#221F1B]">
              Admin Dashboard
            </h1>
          </div>
          <button
            type="button"
            onClick={loadOverview}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EFE8DC] bg-white px-4 py-2 text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-[#221F1B] text-white"
                    : "border border-[#EFE8DC] bg-white text-[#6A6258] hover:text-[#221F1B]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#EFE8DC] bg-white p-5">
                <div className="text-xs text-[#6A6258]">Total Sales</div>
                <div className="mt-1 text-2xl font-bold text-[#221F1B]">
                  {formatINR(data.metrics.totalSales)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#EFE8DC] bg-white p-5">
                <div className="text-xs text-[#6A6258]">Total Orders</div>
                <div className="mt-1 text-2xl font-bold text-[#221F1B]">
                  {data.metrics.totalOrders}
                </div>
                <div className="mt-1 text-[11px] text-[#6A6258]">
                  {data.metrics.pendingOrders} Pending •{" "}
                  {data.metrics.completedOrders} Delivered
                </div>
              </div>
              <div className="rounded-2xl border border-[#EFE8DC] bg-white p-5">
                <div className="text-xs text-[#6A6258]">Total Customers</div>
                <div className="mt-1 text-2xl font-bold text-[#221F1B]">
                  {data.metrics.totalCustomers}
                </div>
              </div>
              <div className="rounded-2xl border border-[#EFE8DC] bg-white p-5">
                <div className="text-xs text-[#6A6258]">Total Products</div>
                <div className="mt-1 text-2xl font-bold text-[#221F1B]">
                  {data.metrics.totalProducts}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6">
              <h2 className="font-luxury text-2xl font-semibold mb-4">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#EFE8DC] text-[#6A6258]">
                    <tr>
                      <th className="py-2 pr-4">Order #</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Payment</th>
                      <th className="py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF7F2]">
                    {data.recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2.5 pr-4 font-semibold">{o.orderNumber}</td>
                        <td className="py-2.5 pr-4">{o.customerName}</td>
                        <td className="py-2.5 pr-4">{o.status}</td>
                        <td className="py-2.5 pr-4">{o.paymentStatus}</td>
                        <td className="py-2.5 font-semibold">
                          {formatINR(o.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RATE MANAGEMENT TAB */}
        {tab === "rates" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleSaveRates}
              className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-4"
            >
              <h2 className="font-luxury text-2xl font-semibold">
                Daily Gold, Silver &amp; Platinum Rates (₹/gram)
              </h2>
              <p className="text-xs text-[#6A6258]">
                Updating rates automatically recalculates all product prices
                based on their net weight, making charges, and GST.
              </p>
              <div className="space-y-3">
                {data.metalRates.map((r) => (
                  <div
                    key={r.metalKey}
                    className="flex items-center justify-between gap-4"
                  >
                    <label className="text-sm font-medium text-[#221F1B]">
                      {r.label}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={rateInputs[r.metalKey] ?? r.ratePerGram}
                      onChange={(e) =>
                        setRateInputs((prev) => ({
                          ...prev,
                          [r.metalKey]: Number(e.target.value),
                        }))
                      }
                      className="w-36 rounded-xl border border-[#EFE8DC] px-3 py-2 text-sm text-right font-semibold"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                Save Rates &amp; Recalculate Prices
              </button>
            </form>

            <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6">
              <h2 className="font-luxury text-2xl font-semibold mb-4">
                Rate Update History
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
                {data.metalRateHistory.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between rounded-xl bg-[#FAF7F2] px-3 py-2"
                  >
                    <span>
                      <strong>{h.metalKey}</strong> — {formatINR(h.ratePerGram)}/g
                    </span>
                    <span className="text-[#6A6258]">
                      {new Date(h.recordedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div className="space-y-6">
            <form
              onSubmit={handleCreateProduct}
              className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-4"
            >
              <h2 className="font-luxury text-2xl font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#A67C42]" /> Add New Product
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <input
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Product Name"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
                <input
                  required
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  placeholder="SKU (e.g. CJ-GR-1999)"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
                <select
                  value={prodCatId}
                  onChange={(e) => setProdCatId(e.target.value)}
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                >
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={prodMetal}
                  onChange={(e) => setProdMetal(e.target.value)}
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                >
                  <option value="GOLD">GOLD</option>
                  <option value="DIAMOND">DIAMOND</option>
                  <option value="SILVER">SILVER</option>
                  <option value="PLATINUM">PLATINUM</option>
                  <option value="BULLION">BULLION</option>
                </select>
                <input
                  value={prodPurity}
                  onChange={(e) => setProdPurity(e.target.value)}
                  placeholder="Purity (e.g. 22KT)"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
                <input
                  type="number"
                  step="0.1"
                  value={prodWeight}
                  onChange={(e) => setProdWeight(e.target.value)}
                  placeholder="Net Weight (g)"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
                <input
                  type="number"
                  step="0.5"
                  value={prodMaking}
                  onChange={(e) => setProdMaking(e.target.value)}
                  placeholder="Making %"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  placeholder="Stock Qty"
                  className="rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
              >
                Create Product
              </button>
            </form>

            <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#EFE8DC] text-[#6A6258]">
                  <tr>
                    <th className="py-2 pr-3">SKU</th>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Metal/Purity</th>
                    <th className="py-2 pr-3">Weight</th>
                    <th className="py-2 pr-3">Live Price</th>
                    <th className="py-2 pr-3">Stock</th>
                    <th className="py-2 pr-3">Flags</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF7F2]">
                  {data.products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 pr-3 font-mono">{p.sku}</td>
                      <td className="py-2.5 pr-3 font-medium">{p.name}</td>
                      <td className="py-2.5 pr-3">
                        {p.metalType} • {p.purity}
                      </td>
                      <td className="py-2.5 pr-3">{p.netWeightGrams}g</td>
                      <td className="py-2.5 pr-3 font-semibold">
                        {formatINR(p.price.finalPrice)}
                      </td>
                      <td className="py-2.5 pr-3">{p.stockQuantity}</td>
                      <td className="py-2.5 pr-3 space-x-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleProductFlag(
                              p.id,
                              "isBestSeller",
                              !p.isBestSeller
                            )
                          }
                          className={`rounded px-2 py-0.5 ${
                            p.isBestSeller
                              ? "bg-[#C59B5F] text-white"
                              : "bg-[#FAF7F2] text-[#6A6258]"
                          }`}
                        >
                          Best
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleProductFlag(
                              p.id,
                              "isPublished",
                              !p.isPublished
                            )
                          }
                          className={`rounded px-2 py-0.5 ${
                            p.isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.isPublished ? "Live" : "Hidden"}
                        </button>
                      </td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-4">
            <h2 className="font-luxury text-2xl font-semibold">
              Order Management
            </h2>
            {data.recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#EFE8DC] p-4 text-xs"
              >
                <div>
                  <div className="font-bold text-sm">{o.orderNumber}</div>
                  <div className="text-[#6A6258]">
                    {o.customerName} • {o.customerPhone} •{" "}
                    {formatINR(o.totalAmount)} ({o.paymentMethod} /{" "}
                    {o.paymentStatus})
                  </div>
                  {o.awbNumber && (
                    <div className="text-emerald-700 mt-0.5">
                      AWB: {o.awbNumber} ({o.courierName})
                    </div>
                  )}
                </div>
                <select
                  value={o.status}
                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                  className="rounded-lg border border-[#EFE8DC] px-3 py-1.5 text-xs font-medium"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === "categories" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-5">
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="New Category Name"
                className="rounded-xl border border-[#EFE8DC] px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-5 py-2 text-xs font-semibold text-white"
              >
                Add Category
              </button>
            </form>
            <div className="grid gap-3 sm:grid-cols-3">
              {data.categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-[#EFE8DC] p-3 text-sm"
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-[#6A6258]">{c.slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANNERS TAB */}
        {tab === "banners" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-5">
            <form onSubmit={handleCreateBanner} className="flex flex-wrap gap-2">
              <input
                required
                value={banHeadline}
                onChange={(e) => setBanHeadline(e.target.value)}
                placeholder="Banner Headline"
                className="flex-1 rounded-xl border border-[#EFE8DC] px-4 py-2 text-sm"
              />
              <input
                required
                value={banCtaLink}
                onChange={(e) => setBanCtaLink(e.target.value)}
                placeholder="Redirect URL (/collections)"
                className="rounded-xl border border-[#EFE8DC] px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-5 py-2 text-xs font-semibold text-white"
              >
                Add Banner
              </button>
            </form>
            <div className="space-y-3">
              {data.banners.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-[#EFE8DC] p-4 text-sm"
                >
                  <div>
                    <div className="font-semibold">{b.headline}</div>
                    <div className="text-xs text-[#6A6258]">{b.ctaLink}</div>
                  </div>
                  <span className="text-xs font-medium text-emerald-700">
                    {b.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS TAB */}
        {tab === "coupons" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-5">
            <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-2">
              <input
                required
                value={coupCode}
                onChange={(e) => setCoupCode(e.target.value)}
                placeholder="Code (e.g. DIWALI10)"
                className="rounded-xl border border-[#EFE8DC] px-3 py-2 text-sm"
              />
              <select
                value={coupType}
                onChange={(e) =>
                  setCoupType(e.target.value as "PERCENTAGE" | "FLAT")
                }
                className="rounded-xl border border-[#EFE8DC] px-3 py-2 text-sm"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
              <input
                type="number"
                value={coupVal}
                onChange={(e) => setCoupVal(e.target.value)}
                placeholder="Value"
                className="w-24 rounded-xl border border-[#EFE8DC] px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={coupMin}
                onChange={(e) => setCoupMin(e.target.value)}
                placeholder="Min Order"
                className="w-32 rounded-xl border border-[#EFE8DC] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-[#221F1B] px-5 py-2 text-xs font-semibold text-white"
              >
                Create Coupon
              </button>
            </form>
            <div className="space-y-2">
              {data.coupons.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-[#EFE8DC] p-3 text-xs"
                >
                  <div>
                    <strong className="text-sm">{c.code}</strong> —{" "}
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}%`
                      : formatINR(c.discountValue)}{" "}
                    off (Min {formatINR(c.minOrderValue)})
                  </div>
                  <span>
                    Used {c.usedCount}/{c.usageLimit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === "reviews" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-3">
            <h2 className="font-luxury text-2xl font-semibold">
              Reviews &amp; Testimonials Moderation
            </h2>
            {data.reviews.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EFE8DC] p-4 text-xs"
              >
                <div>
                  <div className="font-semibold text-sm">
                    {r.customerName} ({r.rating}★) — {r.status}
                  </div>
                  <p className="text-[#6A6258] mt-1">{r.comment}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReviewAction(r.id, "APPROVED", true)}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-white"
                  >
                    Approve &amp; Feature
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReviewAction(r.id, "REJECTED", false)}
                    className="rounded-full bg-red-600 px-3 py-1.5 text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {tab === "customers" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EFE8DC] text-[#6A6258]">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Orders</th>
                  <th className="py-2">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F2]">
                {data.customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 pr-4 font-semibold">{c.name}</td>
                    <td className="py-2.5 pr-4">{c.email}</td>
                    <td className="py-2.5 pr-4">{c.phone}</td>
                    <td className="py-2.5 pr-4">{c.orderCount}</td>
                    <td className="py-2.5 font-semibold">
                      {formatINR(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && settingsDraft && (
          <form
            onSubmit={handleSaveSettings}
            className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-4 max-w-3xl"
          >
            <h2 className="font-luxury text-2xl font-semibold">
              Brand, Checkout &amp; Content Settings
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <label className="text-xs text-[#6A6258]">Business Name</label>
                <input
                  value={settingsDraft.businessName}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      businessName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-[#6A6258]">
                  Logo URL (Upload or Static Path)
                </label>
                <input
                  value={settingsDraft.logoUrl}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      logoUrl: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-[#6A6258]">
                  WhatsApp Number (with 91)
                </label>
                <input
                  value={settingsDraft.whatsappNumber}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      whatsappNumber: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-[#6A6258]">
                  Card Fee MDR (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsDraft.cardFeeMdrPercent}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      cardFeeMdrPercent: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-[#6A6258]">Shop Address</label>
                <input
                  value={settingsDraft.address}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      address: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#EFE8DC] px-3 py-2"
                />
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={settingsDraft.codEnabled}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      codEnabled: e.target.checked,
                    })
                  }
                />
                Enable Cash on Delivery (COD)
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={settingsDraft.goldSavingSchemeEnabled}
                  onChange={(e) =>
                    setSettingsDraft({
                      ...settingsDraft,
                      goldSavingSchemeEnabled: e.target.checked,
                    })
                  }
                />
                Enable Gold Saving Scheme Page
              </label>
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
            >
              Save Settings
            </button>
          </form>
        )}

        {/* REPORTS TAB */}
        {tab === "reports" && (
          <div className="rounded-2xl border border-[#EFE8DC] bg-white p-6 space-y-4">
            <h2 className="font-luxury text-2xl font-semibold">
              Exportable Reports (CSV / Excel Compatible)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { type: "sales", label: "Sales Report (CSV)" },
                { type: "inventory", label: "Inventory Report (CSV)" },
                { type: "customers", label: "Customer Report (CSV)" },
                { type: "gst", label: "GST & Tax Report (CSV)" },
              ].map((rep) => (
                <a
                  key={rep.type}
                  href={`/api/admin/reports?type=${rep.type}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2] p-4 text-xs font-semibold text-[#221F1B] hover:border-[#C59B5F]"
                >
                  <Download className="h-4 w-4 text-[#A67C42]" />
                  {rep.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
