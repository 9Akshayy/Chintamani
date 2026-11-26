import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CART_SESSION_COOKIE, getCurrentSession } from "@/lib/auth";
import {
  enrichProductWithPrice,
  readStore,
  writeStore,
  type CartRecord,
  type StoreDatabase,
} from "@/lib/store";

function computeCartResponse(db: StoreDatabase, cart: CartRecord) {
  const enrichedItems = cart.items
    .map((item) => {
      const product = db.products.find(
        (p) => p.id === item.productId && p.isPublished
      );
      if (!product) return null;
      const enriched = enrichProductWithPrice(product, db.metalRates);
      return {
        id: item.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        imageUrl: product.images[0]?.url || "/images/cat-gold-necklace.jpg",
        metalType: product.metalType,
        purity: product.purity,
        netWeightGrams: product.netWeightGrams,
        selectedSize: item.selectedSize || product.sizeOptions[0] || "Standard",
        sizeOptions: product.sizeOptions,
        quantity: item.quantity,
        stockQuantity: product.stockQuantity,
        unitBreakdown: enriched.price,
        lineTotal: enriched.price.finalPrice * item.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const metalAndMakingSubtotal = enrichedItems.reduce(
    (sum, i) => sum + i.unitBreakdown.subtotal * i.quantity,
    0
  );
  const gstTotal = enrichedItems.reduce(
    (sum, i) => sum + i.unitBreakdown.gstAmount * i.quantity,
    0
  );
  const itemsGrossTotal = enrichedItems.reduce((sum, i) => sum + i.lineTotal, 0);

  let discountAmount = 0;
  let appliedCoupon: { code: string; description: string } | null = null;
  let couponError: string | null = null;

  if (cart.couponCode) {
    const coupon = db.coupons.find(
      (c) =>
        c.code.toUpperCase() === cart.couponCode?.toUpperCase() && c.isActive
    );
    if (!coupon) {
      couponError = "Invalid or inactive coupon code.";
    } else if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      couponError = "This coupon has expired.";
    } else if (coupon.usedCount >= coupon.usageLimit) {
      couponError = "Coupon usage limit reached.";
    } else if (itemsGrossTotal < coupon.minOrderValue) {
      couponError = `Minimum order of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required.`;
    } else {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round(
          (itemsGrossTotal * coupon.discountValue) / 100
        );
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = Math.round(coupon.discountValue);
      }
      appliedCoupon = {
        code: coupon.code,
        description: coupon.description,
      };
    }
  }

  const afterDiscount = Math.max(0, itemsGrossTotal - discountAmount);
  const shippingCharges =
    enrichedItems.length === 0
      ? 0
      : db.settings.freeShippingEnabled &&
          afterDiscount >= db.settings.freeShippingThreshold
        ? 0
        : db.settings.standardShippingCharge;

  const finalTotal = afterDiscount + shippingCharges;

  return {
    items: enrichedItems,
    itemCount: enrichedItems.reduce((sum, i) => sum + i.quantity, 0),
    subtotalBeforeGst: metalAndMakingSubtotal,
    gstTotal,
    itemsGrossTotal,
    discountAmount,
    shippingCharges,
    finalTotal,
    appliedCoupon,
    couponError,
    freeShippingThreshold: db.settings.freeShippingThreshold,
    freeShippingEnabled: db.settings.freeShippingEnabled,
  };
}

async function getOrCreateCart(db: StoreDatabase) {
  const cookieStore = await cookies();
  const session = await getCurrentSession();
  let sid = cookieStore.get(CART_SESSION_COOKIE)?.value;
  let isNewCookie = false;

  if (!sid) {
    sid = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    isNewCookie = true;
  }

  let cart = db.carts.find(
    (c) => c.sessionId === sid || (session && c.userId === session.userId)
  );
  if (!cart) {
    cart = {
      sessionId: sid,
      userId: session?.userId ?? null,
      couponCode: null,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    db.carts.push(cart);
  } else if (session && !cart.userId) {
    cart.userId = session.userId;
  }

  return { cart, sid: cart.sessionId, isNewCookie };
}

export async function GET() {
  const db = readStore();
  const { cart, sid, isNewCookie } = await getOrCreateCart(db);
  const payload = computeCartResponse(db, cart);
  const res = NextResponse.json(payload);
  if (isNewCookie) {
    res.cookies.set(CART_SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readStore();
  const { cart, sid } = await getOrCreateCart(db);

  if (body.action === "apply_coupon") {
    cart.couponCode = body.couponCode ? String(body.couponCode).trim().toUpperCase() : null;
    cart.updatedAt = new Date().toISOString();
    writeStore(db);
    const res = NextResponse.json(computeCartResponse(db, cart));
    res.cookies.set(CART_SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  const productId = String(body.productId || "");
  const quantity = Math.max(1, Number(body.quantity || 1));
  const selectedSize = body.selectedSize ? String(body.selectedSize) : undefined;

  const product = db.products.find((p) => p.id === productId && p.isPublished);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.stockQuantity < 1) {
    return NextResponse.json(
      { error: "This item is currently out of stock." },
      { status: 400 }
    );
  }

  const sizeToUse = selectedSize || product.sizeOptions[0] || "Standard";
  const existing = cart.items.find(
    (i) => i.productId === productId && i.selectedSize === sizeToUse
  );

  if (existing) {
    existing.quantity = Math.min(product.stockQuantity, existing.quantity + quantity);
  } else {
    cart.items.push({
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      selectedSize: sizeToUse,
      quantity: Math.min(product.stockQuantity, quantity),
    });
  }

  cart.updatedAt = new Date().toISOString();
  writeStore(db);

  const res = NextResponse.json(computeCartResponse(db, cart));
  res.cookies.set(CART_SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const db = readStore();
  const { cart } = await getOrCreateCart(db);

  const itemId = String(body.itemId || "");
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const product = db.products.find((p) => p.id === item.productId);
  const maxStock = product?.stockQuantity ?? 10;

  if (typeof body.quantity === "number") {
    if (body.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = Math.min(maxStock, Math.max(1, body.quantity));
    }
  }
  if (typeof body.selectedSize === "string" && body.selectedSize.trim()) {
    item.selectedSize = body.selectedSize.trim();
  }

  cart.updatedAt = new Date().toISOString();
  writeStore(db);
  return NextResponse.json(computeCartResponse(db, cart));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  const db = readStore();
  const { cart } = await getOrCreateCart(db);

  if (itemId) {
    cart.items = cart.items.filter((i) => i.id !== itemId);
  } else {
    cart.items = [];
    cart.couponCode = null;
  }

  cart.updatedAt = new Date().toISOString();
  writeStore(db);
  return NextResponse.json(computeCartResponse(db, cart));
}
