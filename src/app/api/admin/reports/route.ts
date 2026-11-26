import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { enrichProductWithPrice, readStore } from "@/lib/store";

export async function GET(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "sales";
  const db = readStore();

  let csv = "";
  if (type === "inventory") {
    csv = "SKU,Product Name,Metal,Purity,Net Weight (g),Stock,Final Price (INR)\n";
    for (const p of db.products) {
      const enriched = enrichProductWithPrice(p, db.metalRates);
      csv += `"${p.sku}","${p.name.replace(/"/g, '""')}",${p.metalType},${p.purity},${p.netWeightGrams},${p.stockQuantity},${enriched.price.finalPrice}\n`;
    }
  } else if (type === "customers") {
    csv = "Name,Email,Phone,Reward Points,KYC Verified,Created At\n";
    for (const u of db.users.filter((x) => x.role === "CUSTOMER")) {
      csv += `"${u.name}",${u.email},${u.phone},${u.rewardPoints},${u.kycVerified},${u.createdAt}\n`;
    }
  } else if (type === "gst") {
    csv = "Order Number,Invoice Number,Date,Customer,Subtotal (INR),GST (INR),Total (INR),Payment Status\n";
    for (const o of db.orders) {
      csv += `${o.orderNumber},${o.invoiceNumber || "PENDING"},${o.createdAt},"${o.customerName}",${o.subtotal},${o.gstAmount},${o.totalAmount},${o.paymentStatus}\n`;
    }
  } else {
    csv = "Order Number,Date,Customer,Status,Payment Method,Payment Status,Total (INR)\n";
    for (const o of db.orders) {
      csv += `${o.orderNumber},${o.createdAt},"${o.customerName}",${o.status},${o.paymentMethod},${o.paymentStatus},${o.totalAmount}\n`;
    }
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="chintamani-${type}-report.csv"`,
    },
  });
}
