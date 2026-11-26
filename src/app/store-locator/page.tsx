import React from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function StoreLocatorPage() {
  const db = readStore();
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Showroom
          </p>
          <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
            Store Locator
          </h1>
        </div>

        <div className="space-y-8">
          {db.stores.map((s) => (
            <div
              key={s.id}
              className="grid gap-6 rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-6 md:grid-cols-2 items-center"
            >
              <div className="space-y-3 text-sm text-[#6A6258]">
                <h2 className="font-luxury text-2xl font-semibold text-[#221F1B]">
                  {s.name}
                </h2>
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#A67C42] shrink-0 mt-0.5" />
                  <span>
                    {s.addressLine}, {s.city}, {s.state} – {s.pinCode}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#A67C42] shrink-0" />
                  <span>{s.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#A67C42] shrink-0" />
                  <span>{s.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#A67C42] shrink-0" />
                  <span>{s.openingHours}</span>
                </p>
                <a
                  href={s.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 rounded-full bg-[#221F1B] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A67C42]"
                >
                  Get Directions
                </a>
              </div>
              <div className="h-72 overflow-hidden rounded-2xl border border-[#EFE8DC] bg-white">
                <iframe
                  title={s.name}
                  src={s.mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
