import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CART_SESSION_COOKIE, getCurrentSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = String(body.orderId || "");
    const providerOrderId = String(body.providerOrderId || "");
    const providerPaymentId = String(body.providerPaymentId || "");
    const providerSignature = String(body.providerSignature || "");
    const demoConfirm = Boolean(body.demoConfirm);

    const db = readStore();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
    if (razorpayKeySecret && !demoConfirm) {
      const expected = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${providerOrderId}|${providerPaymentId}`)
        .digest("hex");

      if (expected !== providerSignature) {
        order.paymentStatus = "FAILED";
        order.updatedAt = new Date().toISOString();
        writeStore(db);
        return NextResponse.json(
          { error: "Payment signature verification failed." },
          { status: 400 }
        );
      }
    } else if (!demoConfirm) {
      return NextResponse.json(
        { error: "Payment verification token missing." },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== "PAID") {
      order.paymentStatus = "PAID";
      order.status = "CONFIRMED";
      order.providerPaymentId =
        providerPaymentId || `demo_pay_${Date.now()}`;
      order.invoiceNumber = `INV-${order.orderNumber}`;
      order.updatedAt = new Date().toISOString();

      for (const item of order.items) {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        }
      }

      if (order.couponCode) {
        const coupon = db.coupons.find(
          (c) => c.code.toUpperCase() === order.couponCode?.toUpperCase()
        );
        if (coupon) coupon.usedCount += 1;
      }

      const session = await getCurrentSession();
      const cookieStore = await cookies();
      const sid = cookieStore.get(CART_SESSION_COOKIE)?.value;
      const cart = db.carts.find(
        (c) => c.sessionId === sid || (session && c.userId === session.userId)
      );
      if (cart) {
        cart.items = [];
        cart.couponCode = null;
      }

      writeStore(db);
    }

    return NextResponse.json({ verified: true, order });
  } catch {
    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
