import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { enrichProductWithPrice, readStore, writeStore } from "@/lib/store";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ items: [], authenticated: false });
  }
  const db = readStore();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ items: [], authenticated: false });
  }
  const items = db.products
    .filter((p) => p.isPublished && user.wishlistProductIds.includes(p.id))
    .map((p) => enrichProductWithPrice(p, db.metalRates));

  return NextResponse.json({ items, authenticated: true });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in to save items to your wishlist." },
      { status: 401 }
    );
  }
  const body = await request.json();
  const productId = String(body.productId || "");
  const db = readStore();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const exists = user.wishlistProductIds.includes(productId);
  if (exists) {
    user.wishlistProductIds = user.wishlistProductIds.filter(
      (id) => id !== productId
    );
  } else {
    user.wishlistProductIds.push(productId);
  }
  writeStore(db);

  return NextResponse.json({
    saved: !exists,
    wishlistProductIds: user.wishlistProductIds,
  });
}
