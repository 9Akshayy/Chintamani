"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton({
  whatsappNumber,
  businessName,
}: {
  whatsappNumber: string;
  businessName: string;
}) {
  const [open, setOpen] = useState(false);

  const buildLink = (text: string) => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `${text}\nPage: ${currentUrl}`
    )}`;
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
      {open && (
        <div className="mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#EFE8DC] bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-2.5">
            <div>
              <div className="text-sm font-semibold text-[#221F1B]">
                {businessName} Concierge
              </div>
              <div className="text-[11px] text-[#6A6258]">
                Instant WhatsApp Assistance
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#6A6258] hover:text-[#221F1B] p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <a
              href={buildLink("Hello! I would like to enquire about a jewellery piece.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#FAF7F2] px-3 py-2 text-[#221F1B] hover:bg-[#EFE8DC]"
            >
              Enquire about a Product / Availability
            </a>
            <a
              href={buildLink("Hello! Please share today's gold & silver rates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#FAF7F2] px-3 py-2 text-[#221F1B] hover:bg-[#EFE8DC]"
            >
              Ask About Today&apos;s Gold Rates
            </a>
            <a
              href={buildLink("Hello! I would like to request a custom quotation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#FAF7F2] px-3 py-2 text-[#221F1B] hover:bg-[#EFE8DC]"
            >
              Request a Quotation
            </a>
            <a
              href={buildLink("Hello! I need customer support with an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#FAF7F2] px-3 py-2 text-[#221F1B] hover:bg-[#EFE8DC]"
            >
              Customer Support
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-transform hover:scale-105 hover:bg-emerald-700"
        aria-label="WhatsApp Concierge"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
