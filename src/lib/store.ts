import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_FAQS,
  INITIAL_METAL_RATES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SITE_SETTINGS,
  INITIAL_STORES,
  type DemoBanner,
  type DemoCategory,
  type DemoContactEnquiry,
  type DemoCoupon,
  type DemoFaq,
  type DemoMetalRate,
  type DemoMetalRateHistory,
  type DemoOrder,
  type DemoProduct,
  type DemoReturnRequest,
  type DemoReview,
  type DemoStoreLocation,
  type DemoUser,
  type SiteSettingsConfig,
} from "./demo-data";
import { calculateJewelleryPrice, type MetalRateMap } from "./pricing";

export interface CartRecord {
  sessionId: string;
  userId?: string | null;
  couponCode?: string | null;
  items: {
    id: string;
    productId: string;
    selectedSize?: string;
    quantity: number;
  }[];
  updatedAt: string;
}

export interface StoreDatabase {
  settings: SiteSettingsConfig;
  categories: DemoCategory[];
  products: DemoProduct[];
  metalRates: DemoMetalRate[];
  metalRateHistory: DemoMetalRateHistory[];
  banners: DemoBanner[];
  coupons: DemoCoupon[];
  reviews: DemoReview[];
  stores: DemoStoreLocation[];
  faqs: DemoFaq[];
  users: DemoUser[];
  carts: CartRecord[];
  orders: DemoOrder[];
  returnRequests: DemoReturnRequest[];
  contactEnquiries: DemoContactEnquiry[];
  newsletterSubscribers: { id: string; email: string; createdAt: string }[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "store-db.json");

function createInitialDb(): StoreDatabase {
  const adminEmail =
    process.env.ADMIN_EMAIL || "admin@chintamanijewellers.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe@2026!";

  const adminHash = bcrypt.hashSync(adminPassword, 10);
  const customerHash = bcrypt.hashSync("Customer@2026!", 10);

  return {
    settings: INITIAL_SITE_SETTINGS,
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    metalRates: INITIAL_METAL_RATES,
    metalRateHistory: INITIAL_METAL_RATES.map((r) => ({
      id: `hist-${r.id}`,
      metalKey: r.metalKey,
      ratePerGram: r.ratePerGram,
      source: r.source,
      note: "Initial demonstration rate",
      updatedBy: r.updatedBy,
      recordedAt: r.updatedAt,
    })),
    banners: INITIAL_BANNERS,
    coupons: INITIAL_COUPONS,
    reviews: INITIAL_REVIEWS,
    stores: INITIAL_STORES,
    faqs: INITIAL_FAQS,
    users: [
      {
        id: "user-admin-1",
        name: "Store Administrator",
        email: adminEmail.toLowerCase(),
        phone: "+91 98765 43210",
        passwordHash: adminHash,
        role: "SUPER_ADMIN",
        isActive: true,
        preferredLanguage: "en",
        rewardPoints: 0,
        kycVerified: true,
        createdAt: "2026-11-01T09:00:00+05:30",
        addresses: [],
        wishlistProductIds: [],
      },
      {
        id: "user-cust-1",
        name: "Ananya Patwardhan",
        email: "customer@example.com",
        phone: "+91 98230 11223",
        passwordHash: customerHash,
        role: "CUSTOMER",
        isActive: true,
        preferredLanguage: "en",
        rewardPoints: 250,
        kycVerified: false,
        createdAt: "2026-11-05T10:00:00+05:30",
        addresses: [
          {
            id: "addr-1",
            label: "Home",
            fullName: "Ananya Patwardhan",
            phone: "+91 98230 11223",
            line1: "14 Gulmohar Residency, Savedi",
            city: "Ahilyanagar",
            state: "Maharashtra",
            pinCode: "414003",
            country: "India",
            isDefault: true,
          },
        ],
        wishlistProductIds: ["prod-1", "prod-2"],
      },
    ],
    carts: [],
    orders: [
      {
        id: "ord-demo-1",
        orderNumber: "CJ-2026-1001",
        userId: "user-cust-1",
        customerName: "Ananya Patwardhan",
        customerEmail: "customer@example.com",
        customerPhone: "+91 98230 11223",
        shippingAddress: {
          fullName: "Ananya Patwardhan",
          phone: "+91 98230 11223",
          line1: "14 Gulmohar Residency, Savedi",
          city: "Ahilyanagar",
          state: "Maharashtra",
          pinCode: "414003",
          country: "India",
        },
        status: "DELIVERED",
        paymentStatus: "PAID",
        paymentMethod: "UPI",
        providerOrderId: "demo_order_1001",
        providerPaymentId: "demo_pay_1001",
        subtotal: 98556,
        makingChargesTotal: 8627,
        stoneChargesTotal: 11500,
        discountAmount: 0,
        shippingCharges: 0,
        gstAmount: 2957,
        cardFeeAmount: 0,
        totalAmount: 101513,
        invoiceNumber: "INV-CJ-2026-1001",
        awbNumber: "BD-99887766",
        courierName: "BlueDart Insured",
        items: [
          {
            id: "oi-demo-1",
            productId: "prod-3",
            productName: "Saubhagya Diamond Vati Mangalsutra (Demo)",
            sku: "CJ-MS-3002",
            selectedSize: "18 Inch",
            quantity: 1,
            metalRatePerGram: 7195,
            metalValue: 78426,
            makingCharges: 8627,
            stoneCharges: 11500,
            gstAmount: 2957,
            unitPrice: 101510,
            totalPrice: 101510,
          },
        ],
        createdAt: "2026-11-14T15:30:00+05:30",
        updatedAt: "2026-11-18T11:00:00+05:30",
      },
    ],
    returnRequests: [],
    contactEnquiries: [],
    newsletterSubscribers: [],
  };
}

export function readStore(): StoreDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = createInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as StoreDatabase;
  } catch {
    return createInitialDb();
  }
}

export function writeStore(db: StoreDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

export function getRateMap(rates: DemoMetalRate[]): MetalRateMap {
  const map: MetalRateMap = {
    GOLD_24KT: 7850,
    GOLD_22KT: 7195,
    GOLD_18KT: 5890,
    GOLD_14KT: 4580,
    SILVER_999: 96,
    PLATINUM_950: 3150,
  };
  for (const r of rates) {
    map[r.metalKey] = r.ratePerGram;
  }
  return map;
}

export function enrichProductWithPrice(
  product: DemoProduct,
  rates: DemoMetalRate[]
) {
  const rateMap = getRateMap(rates);
  const price = calculateJewelleryPrice({
    metalType: product.metalType,
    purity: product.purity,
    netWeightGrams: product.netWeightGrams,
    makingChargeType: product.makingChargeType,
    makingChargeValue: product.makingChargeValue,
    stoneCharges: product.stoneCharges,
    additionalCharges: product.additionalCharges,
    gstPercent: product.gstPercent,
    fixedPriceOverride: product.fixedPriceOverride,
    rates: rateMap,
  });

  return {
    ...product,
    price,
  };
}

export type EnrichedProduct = ReturnType<typeof enrichProductWithPrice>;
