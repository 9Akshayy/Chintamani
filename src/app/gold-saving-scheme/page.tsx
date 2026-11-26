import React from "react";
import Link from "next/link";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function GoldSavingSchemePage() {
  const db = readStore();
  const enabled = db.settings.goldSavingSchemeEnabled;

  return (
    <div className="bg-white py-14 min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
          {db.settings.businessName}
        </p>
        <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
          Gold Saving Scheme
        </h1>
        {enabled ? (
          <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-8 text-sm text-[#6A6258]">
            Please contact our Ahilyanagar showroom or message us on WhatsApp
            for official, business-approved Gold Saving Scheme enrolment
            details and terms.
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-8 text-sm text-[#6A6258] space-y-4">
            <p>
              Online Gold Saving Scheme enrolment is not currently enabled by
              the store administrator.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Contact Showroom
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
