# Chintamani Jewellers — Premium Jewellery E-Commerce Platform

A complete, full-stack, responsive jewellery e-commerce web application built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma ORM**.

---

## Features Implemented

- **Brand & Luxury Design**: Champagne Gold (`#C59B5F`), Ivory (`#FAF7F2`), Pure White (`#FFFFFF`), Dark Charcoal (`#221F1B`), and Soft Beige (`#EFE8DC`) palette with English & Marathi (`मराठी`) language toggle.
- **13-Section Luxury Homepage**: Promotional Hero Banner slider, Live/Manual Gold/Silver/Platinum Rates board, 12-Category Grid, Best Sellers, Shop By Occasion, New Arrivals, Featured Collections, Why Choose Us, About Our Brand, Customer Testimonials, Store Locator with Google Maps, Newsletter, and Footer.
- **Dynamic Jewellery Pricing Engine** (`src/lib/pricing.ts`):
  `Final Price = (Net Weight × Configured Metal Rate) + Making Charges (% / per-gram / fixed) + Stone Charges + Additional Charges + GST (3%)`
- **Catalog & Product Detail Pages**: Separate routes for Gold, Diamond, Silver, Platinum, Gold Coins, Silver Coins, Bullion, and All Jewellery with desktop/mobile filters, grid/list view, sorting, smart search suggestions, interactive image zoom, transparent price breakdown, WhatsApp product enquiry, and recently viewed items.
- **Persistent Cart & Secure Checkout**: Cookie-persisted shopping bag, coupon validation, guest & registered checkout, Razorpay integration (with safe Demo Payment Verification mode when live keys are omitted), and Admin-toggleable COD & Card MDR %.
- **Customer Account & Wishlist**: Registration, login, password reset request, profile & password management, saved addresses, order history & AWB tracking, return requests, and wishlist.
- **Protected Admin Dashboard** (`/admin`): Sales/order/customer/product analytics, daily metal rate updates with history, product CRUD, category/banner/coupon management, order status & AWB updates, review moderation, site settings, and CSV reports (Sales, Inventory, Customers, GST).
- **SEO & Policies**: XML Sitemap (`/sitemap.xml`), `robots.txt`, Product & JewelryStore JSON-LD structured data, educational guides (`/guides/*`), and configurable legal/policy pages (`/policies/*`).

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Next.js App Router API Routes (`/api/*`) with Zod validation
- **Auth**: HTTP-only JWT session cookies (`jose`) + `bcryptjs` password hashing
- **Database**: PostgreSQL + Prisma ORM (`prisma/schema.prisma`) — includes an automatic local JSON persistence fallback (`.data/store-db.json`) for zero-config local preview when PostgreSQL is not running.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: 32+ character random secret for session signing
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay keys (leave blank for safe Demo Verification mode)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Store WhatsApp number with country code (e.g. `919876543210`)
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Initial admin credentials

### 3. Database Setup (PostgreSQL + Prisma)

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Default Demonstration Accounts

- **Admin Portal** (`/admin`):
  - Email: `admin@chintamanijewellers.in` (or `ADMIN_EMAIL` from `.env`)
  - Password: `ChangeMe@2026!` (or `ADMIN_PASSWORD` from `.env`)
- **Customer Account** (`/account`):
  - Email: `customer@example.com`
  - Password: `Customer@2026!`

> **Note**: Sample products and initial metal rates are clearly labelled as demonstration data. Update all rates, shop address, HSN codes, verified certifications, and legal policies from the Admin Panel before going live.

---

## Production Build & Deployment

```bash
npm run build
npm start
```

Recommended hosting: **Vercel** (Next.js) + **Managed PostgreSQL** (Neon / Supabase / RDS). Configure all `.env` variables in your hosting provider's dashboard before deploying.
