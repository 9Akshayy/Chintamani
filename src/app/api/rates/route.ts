import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { MetalRateMap } from "@/lib/pricing";

const updateRatesSchema = z.object({
  rates: z.array(
    z.object({
      metalKey: z.enum([
        "GOLD_24KT",
        "GOLD_22KT",
        "GOLD_18KT",
        "GOLD_14KT",
        "SILVER_999",
        "PLATINUM_950",
      ]),
      ratePerGram: z.number().positive(),
    })
  ),
  note: z.string().optional(),
  isDemo: z.boolean().optional(),
});

export async function GET() {
  const db = readStore();
  return NextResponse.json({
    rates: db.metalRates,
    history: db.metalRateHistory.slice(0, 30),
    apiConfigured: Boolean(process.env.METAL_RATE_API_URL),
  });
}

export async function PUT(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateRatesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid rate payload" },
        { status: 400 }
      );
    }

    const db = readStore();
    const now = new Date().toISOString();

    for (const item of parsed.data.rates) {
      const target = db.metalRates.find(
        (r) => r.metalKey === (item.metalKey as keyof MetalRateMap)
      );
      if (target) {
        target.previousRatePerGram = target.ratePerGram;
        target.ratePerGram = item.ratePerGram;
        target.source = "MANUAL";
        target.updatedBy = admin.name;
        if (typeof parsed.data.isDemo === "boolean") {
          target.isDemo = parsed.data.isDemo;
        }
        target.updatedAt = now;

        db.metalRateHistory.unshift({
          id: `hist-${Date.now()}-${item.metalKey}`,
          metalKey: item.metalKey,
          ratePerGram: item.ratePerGram,
          source: "MANUAL",
          note: parsed.data.note || "Updated via Admin Rate Manager",
          updatedBy: admin.name,
          recordedAt: now,
        });
      }
    }

    writeStore(db);
    return NextResponse.json({
      rates: db.metalRates,
      history: db.metalRateHistory.slice(0, 30),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to update metal rates" },
      { status: 500 }
    );
  }
}
