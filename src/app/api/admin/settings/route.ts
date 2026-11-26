import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const db = readStore();
  return NextResponse.json({ settings: db.settings });
}

export async function PUT(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const body = await request.json();
  const db = readStore();
  db.settings = {
    ...db.settings,
    ...body,
    policies: {
      ...db.settings.policies,
      ...(body.policies || {}),
    },
    seo: {
      ...db.settings.seo,
      ...(body.seo || {}),
    },
  };
  writeStore(db);
  return NextResponse.json({ settings: db.settings });
}
