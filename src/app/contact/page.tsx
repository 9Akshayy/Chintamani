"use client";

import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettingsConfig } from "@/lib/demo-data";

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettingsConfig | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, subject, message }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(data.message);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } else {
      setStatus(data.error || "Unable to submit enquiry");
    }
  }

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C42]">
            Personal Assistance
          </p>
          <h1 className="font-luxury text-4xl font-semibold text-[#221F1B]">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-[#6A6258]">
            Have a question about sizing, custom orders, or today&apos;s rates?
            Reach out to our team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-[#EFE8DC] bg-[#FAF7F2] p-8 space-y-5">
            <h2 className="font-luxury text-2xl font-semibold">
              {settings?.businessName || "Chintamani Jewellers"}
            </h2>
            <div className="space-y-3 text-sm text-[#6A6258]">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-[#A67C42] shrink-0 mt-0.5" />
                <span>{settings?.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#A67C42] shrink-0" />
                <span>{settings?.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-[#A67C42] shrink-0" />
                <span>{settings?.email}</span>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#EFE8DC] p-8 space-y-4"
          >
            <h2 className="font-luxury text-2xl font-semibold">
              Send an Enquiry
            </h2>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name *"
              className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number *"
                className="rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
              />
            </div>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject *"
              className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
            />
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you? *"
              className="w-full rounded-xl border border-[#EFE8DC] px-4 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-[#221F1B] px-7 py-3 text-sm font-semibold text-white hover:bg-[#A67C42]"
            >
              Submit Enquiry
            </button>
            {status && (
              <p className="text-xs font-medium text-emerald-700">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
