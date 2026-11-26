import React from "react";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function FaqPage() {
  const db = readStore();
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Help Centre
          </p>
          <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-4">
          {db.faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-[#EFE8DC] bg-[#FAF7F2]/60 p-6"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A67C42]">
                {f.category}
              </span>
              <h2 className="mt-1 font-luxury text-xl font-semibold text-[#221F1B]">
                {f.question}
              </h2>
              <p className="mt-2 text-sm text-[#6A6258] leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
