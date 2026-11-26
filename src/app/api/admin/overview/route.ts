import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { enrichProductWithPrice, readStore } from "@/lib/store";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const db = readStore();
  const paidOrders = db.orders.filter((o) => o.paymentStatus === "PAID");
  const totalSales = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = db.orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING"
  ).length;
  const completedOrders = db.orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = db.orders.filter((o) => o.status === "CANCELLED").length;
  const customers = db.users
    .filter((u) => u.role === "CUSTOMER")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      isActive: u.isActive,
      rewardPoints: u.rewardPoints,
      kycVerified: u.kycVerified,
      createdAt: u.createdAt,
      orderCount: db.orders.filter((o) => o.userId === u.id).length,
      totalSpent: db.orders
        .filter((o) => o.userId === u.id && o.paymentStatus === "PAID")
        .reduce((s, o) => s + o.totalAmount, 0),
    }));

  const monthlyMap = new Map<string, number>();
  for (const o of paidOrders) {
    const month = o.createdAt.slice(0, 7);
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + o.totalAmount);
  }
  const monthlySales = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return NextResponse.json({
    metrics: {
      totalSales,
      totalOrders: db.orders.length,
      totalCustomers: customers.length,
      totalProducts: db.products.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    },
    monthlySales,
    recentOrders: db.orders.slice(0, 10),
    customers,
    products: db.products.map((p) => enrichProductWithPrice(p, db.metalRates)),
    categories: db.categories,
    metalRates: db.metalRates,
    metalRateHistory: db.metalRateHistory.slice(0, 20),
    banners: db.banners,
    coupons: db.coupons,
    reviews: db.reviews,
    returns: db.returnRequests,
    enquiries: db.contactEnquiries,
    settings: db.settings,
  });
}
