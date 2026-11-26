import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  const db = readStore();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      rewardPoints: user.rewardPoints,
      kycVerified: user.kycVerified,
      addresses: user.addresses,
      wishlistProductIds: user.wishlistProductIds,
    },
  });
}
