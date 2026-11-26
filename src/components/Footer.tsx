import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettingsConfig } from "@/lib/demo-data";

export function Footer({ settings }: { settings: SiteSettingsConfig }) {
  return (
    <footer className="border-t border-[#EFE8DC] bg-[#FAF7F2] text-[#221F1B] pb-20 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logoUrl || "/images/brand-crest.svg"}
                alt={settings.businessName}
                className="h-10 w-10 rounded-full border border-[#EFE8DC] bg-white p-1"
              />
              <div>
                <h3 className="font-luxury text-2xl font-semibold">
                  {settings.businessName}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#A67C42]">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#6A6258] max-w-md">
              Fine gold, diamond, silver, and platinum jewellery crafted with
              transparent weight disclosure, honest billing, and timeless
              craftsmanship in Ahilyanagar, Maharashtra.
            </p>
            <div className="space-y-1.5 text-xs text-[#6A6258]">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#A67C42] mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#A67C42]" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#A67C42]" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-luxury text-lg font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#6A6258]">
              <li><Link href="/about" className="hover:text-[#A67C42]">About Us</Link></li>
              <li><Link href="/collections" className="hover:text-[#A67C42]">Our Collections</Link></li>
              <li><Link href="/store-locator" className="hover:text-[#A67C42]">Store Locator</Link></li>
              <li><Link href="/faq" className="hover:text-[#A67C42]">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-[#A67C42]">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-[#A67C42]">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Jewellery Categories */}
          <div>
            <h4 className="font-luxury text-lg font-semibold mb-3">
              Jewellery
            </h4>
            <ul className="space-y-2 text-sm text-[#6A6258]">
              <li><Link href="/jewellery/gold" className="hover:text-[#A67C42]">Gold Jewellery</Link></li>
              <li><Link href="/jewellery/diamond" className="hover:text-[#A67C42]">Diamond Jewellery</Link></li>
              <li><Link href="/jewellery/silver" className="hover:text-[#A67C42]">Silver Jewellery</Link></li>
              <li><Link href="/jewellery/platinum" className="hover:text-[#A67C42]">Platinum Jewellery</Link></li>
              <li><Link href="/jewellery/gold-coins" className="hover:text-[#A67C42]">Gold Coins</Link></li>
              <li><Link href="/jewellery/bullion" className="hover:text-[#A67C42]">Bullion</Link></li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div>
            <h4 className="font-luxury text-lg font-semibold mb-3">
              Guides &amp; Policies
            </h4>
            <ul className="space-y-2 text-sm text-[#6A6258]">
              <li><Link href="/guides/jewellery-care" className="hover:text-[#A67C42]">Jewellery Care Guide</Link></li>
              <li><Link href="/guides/ring-size" className="hover:text-[#A67C42]">Ring Size Guide</Link></li>
              <li><Link href="/guides/gold-purity" className="hover:text-[#A67C42]">Gold Purity Guide</Link></li>
              <li><Link href="/guides/diamond" className="hover:text-[#A67C42]">Diamond Guide</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-[#A67C42]">Shipping &amp; Delivery</Link></li>
              <li><Link href="/policies/returns" className="hover:text-[#A67C42]">Returns &amp; Exchanges</Link></li>
              <li><Link href="/policies/refund" className="hover:text-[#A67C42]">Refund Policy</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-[#A67C42]">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-[#A67C42]">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EFE8DC] pt-6 text-xs text-[#6A6258]">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights
            reserved. Demonstration catalog prices &amp; rates are clearly
            labelled.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-[#EFE8DC] bg-white px-2.5 py-1">Razorpay</span>
            <span className="rounded border border-[#EFE8DC] bg-white px-2.5 py-1">UPI</span>
            <span className="rounded border border-[#EFE8DC] bg-white px-2.5 py-1">Visa / Mastercard</span>
            <span className="rounded border border-[#EFE8DC] bg-white px-2.5 py-1">Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
