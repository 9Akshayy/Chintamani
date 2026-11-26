import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { CART_SESSION_COOKIE, getCurrentSession } from "@/lib/auth";
import {
  enrichProductWithPrice,
  readStore,
  writeStore,
} from "@/lib/store";
import type { DemoOrder, DemoOrderItem } from "@/lib/demo-data";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(10, "Valid mobile number is required"),
  line1: z.string().trim().min(4, "Delivery address is required"),
  line2: z.string().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pinCode: z.string().trim().regex(/^\d{6}$/, "Valid 6-digit PIN code is required"),
  country: z.string().trim().default("India"),
  paymentMethod: z.enum(["RAZORPAY", "UPI", "CARD", "NET_BANKING", "COD"]),
  couponCode: z.string().optional().nullable(),
  notes: z.string().optional(),
  directBuyProductId: z.string().optional(),
  directBuySize: z.string().optional(),
  directBuyQuantity: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid checkout details" },
        { status: 400 }
      );
    }

    const db = readStore();
    const session = await getCurrentSession();
    const cookieStore = await cookies();
    const sid = cookieStore.get(CART_SESSION_COOKIE)?.value;

    if (parsed.data.paymentMethod === "COD" && !db.settings.codEnabled) {
      return NextResponse.json(
        {
          error:
            "Cash on Delivery is currently disabled by the store administrator.",
        },
        { status: 400 }
      );
    }

    const cart = db.carts.find(
      (c) => c.sessionId === sid || (session && c.userId === session.userId)
    );

    const requestedItems: {
      productId: string;
      selectedSize?: string;
      quantity: number;
    }[] = parsed.data.directBuyProductId
      ? [
          {
            productId: parsed.data.directBuyProductId,
            selectedSize: parsed.data.directBuySize,
            quantity: parsed.data.directBuyQuantity ?? 1,
          },
        ]
      : cart?.items || [];

    if (requestedItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const orderItems: DemoOrderItem[] = [];
    let subtotalBeforeGst = 0;
    let makingChargesTotal = 0;
    let stoneChargesTotal = 0;
    let gstAmount = 0;
    let grossItemsTotal = 0;

    for (const reqItem of requestedItems) {
      const product = db.products.find(
        (p) => p.id === reqItem.productId && p.isPublished
      );
      if (!product) {
        return NextResponse.json(
          { error: "One of the selected items is no longer available." },
          { status: 400 }
        );
      }
      if (product.stockQuantity < reqItem.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          },
          { status: 400 }
        );
      }

      const enriched = enrichProductWithPrice(product, db.metalRates);
      const qty = reqItem.quantity;

      subtotalBeforeGst += enriched.price.subtotal * qty;
      makingChargesTotal += enriched.price.makingCharges * qty;
      stoneChargesTotal += enriched.price.stoneCharges * qty;
      gstAmount += enriched.price.gstAmount * qty;
      grossItemsTotal += enriched.price.finalPrice * qty;

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        selectedSize: reqItem.selectedSize || product.sizeOptions[0] || "Standard",
        quantity: qty,
        metalRatePerGram: enriched.price.ratePerGram,
        metalValue: enriched.price.metalValue,
        makingCharges: enriched.price.makingCharges,
        stoneCharges: enriched.price.stoneCharges,
        gstAmount: enriched.price.gstAmount,
        unitPrice: enriched.price.finalPrice,
        totalPrice: enriched.price.finalPrice * qty,
      });
    }

    let discountAmount = 0;
    const couponToCheck = parsed.data.couponCode ?? cart?.couponCode ?? null;
    if (couponToCheck) {
      const coupon = db.coupons.find(
        (c) =>
          c.code.toUpperCase() === couponToCheck.toUpperCase() &&
          c.isActive &&
          new Date(c.expiresAt).getTime() >= Date.now() &&
          c.usedCount < c.usageLimit &&
          grossItemsTotal >= c.minOrderValue
      );
      if (coupon) {
        discountAmount =
          coupon.discountType === "PERCENTAGE"
            ? Math.round((grossItemsTotal * coupon.discountValue) / 100)
            : Math.round(coupon.discountValue);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      }
    }

    const afterDiscount = Math.max(0, grossItemsTotal - discountAmount);
    const shippingCharges =
      db.settings.freeShippingEnabled &&
      afterDiscount >= db.settings.freeShippingThreshold
        ? 0
        : db.settings.standardShippingCharge;

    const cardFeeAmount =
      parsed.data.paymentMethod === "CARD" && db.settings.cardFeeMdrPercent > 0
        ? Math.round(
            ((afterDiscount + shippingCharges) *
              db.settings.cardFeeMdrPercent) /
              100
          )
        : 0;

    const totalAmount = afterDiscount + shippingCharges + cardFeeAmount;
    const orderNumber = `CJ-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const isLiveRazorpay = Boolean(razorpayKeyId && razorpayKeySecret);

    let providerOrderId = `demo_order_${Date.now()}`;
    let paymentMode: "RAZORPAY" | "DEMO" | "COD" =
      parsed.data.paymentMethod === "COD" ? "COD" : "DEMO";

    if (parsed.data.paymentMethod !== "COD" && isLiveRazorpay) {
      const authHeader = Buffer.from(
        `${razorpayKeyId}:${razorpayKeySecret}`
      ).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          currency: "INR",
          receipt: orderNumber,
        }),
      });
      if (!rzpRes.ok) {
        return NextResponse.json(
          { error: "Unable to initiate Razorpay payment order." },
          { status: 502 }
        );
      }
      const rzpData = (await rzpRes.json()) as { id: string };
      providerOrderId = rzpData.id;
      paymentMode = "RAZORPAY";
    }

    const now = new Date().toISOString();
    const order: DemoOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: session?.userId ?? null,
      customerName: parsed.data.fullName,
      customerEmail: parsed.data.email,
      customerPhone: parsed.data.phone,
      shippingAddress: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        line1: parsed.data.line1,
        line2: parsed.data.line2,
        city: parsed.data.city,
        state: parsed.data.state,
        pinCode: parsed.data.pinCode,
        country: parsed.data.country,
      },
      status: parsed.data.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: parsed.data.paymentMethod,
      providerOrderId,
      subtotal: subtotalBeforeGst,
      makingChargesTotal,
      stoneChargesTotal,
      discountAmount,
      shippingCharges,
      gstAmount,
      cardFeeAmount,
      totalAmount,
      couponCode: couponToCheck,
      notes: parsed.data.notes,
      items: orderItems,
      createdAt: now,
      updatedAt: now,
    };

    if (parsed.data.paymentMethod === "COD") {
      // COD confirmed immediately (payment remains PENDING until delivery)
      for (const item of order.items) {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod) prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      }
      order.invoiceNumber = `INV-${order.orderNumber}`;
      if (!parsed.data.directBuyProductId && cart) {
        cart.items = [];
        cart.couponCode = null;
      }
    }

    db.orders.unshift(order);
    writeStore(db);

    return NextResponse.json({
      order,
      payment: {
        mode: paymentMode,
        razorpayKeyId: isLiveRazorpay ? razorpayKeyId : null,
        providerOrderId,
        amountPaise: totalAmount * 100,
        currency: "INR",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process checkout." },
      { status: 500 }
    );
  }
}
