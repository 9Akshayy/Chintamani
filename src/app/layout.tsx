import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { readStore } from "@/lib/store";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#7A5110",
};

export async function generateMetadata(): Promise<Metadata> {
  const db = readStore();
  return {
    title: db.settings.seo.metaTitle,
    description: db.settings.seo.metaDescription,
    openGraph: {
      title: db.settings.seo.metaTitle,
      description: db.settings.seo.metaDescription,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = readStore();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: db.settings.businessName,
    description: db.settings.seo.metaDescription,
    telephone: db.settings.phone,
    email: db.settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: db.settings.address,
      addressLocality: "Ahilyanagar",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#221F1B] overflow-x-hidden selection:bg-[#C59B5F] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <StoreProvider>
          <Header settings={db.settings} metalRates={db.metalRates} />
          <main className="flex-1">{children}</main>
          <Footer settings={db.settings} />
          <CartDrawer />
          <QuickViewModal whatsappNumber={db.settings.whatsappNumber} />
          <WhatsAppButton
            whatsappNumber={db.settings.whatsappNumber}
            businessName={db.settings.businessName}
          />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
