import React from "react";
import { notFound } from "next/navigation";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const POLICY_TITLES: Record<string, string> = {
  shipping: "Shipping & Delivery Policy",
  returns: "Returns & Exchanges Policy",
  refund: "Refund Policy",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = POLICY_TITLES[slug];
  if (!title) notFound();

  const db = readStore();
  const content =
    db.settings.policies[slug as keyof typeof db.settings.policies] || "";

  return (
    <div className="bg-white py-12 min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            {db.settings.businessName} Policies
          </p>
          <h1 className="mt-1 font-luxury text-4xl font-semibold text-[#221F1B]">
            {title}
          </h1>
        </div>
        <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2]/60 p-8 text-sm leading-relaxed text-[#221F1B] space-y-4">
          <p>{content}</p>
          <p className="text-xs text-[#6A6258] border-t border-[#EFE8DC] pt-4">
            Note: All store policies are configurable from the Admin Panel and
            should be reviewed and approved by the business&apos;s legal advisor
            before going live.
          </p>
        </div>
      </div>
    </div>
  );
}
