import type { MakingChargeMode, MetalRateMap, MetalTypeKey } from "./pricing";

export interface DemoCategory {
  id: string;
  name: string;
  nameMr: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DemoProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface DemoProduct {
  id: string;
  name: string;
  nameMr: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  metalType: MetalTypeKey;
  purity: string;
  diamondQuality?: string | null;
  grossWeightGrams: number;
  netWeightGrams: number;
  stoneWeightGrams: number;
  makingChargeType: MakingChargeMode;
  makingChargeValue: number;
  stoneCharges: number;
  additionalCharges: number;
  gstPercent: number;
  hsnCode: string;
  fixedPriceOverride?: number | null;
  occasions: string[];
  collectionTag?: string | null;
  sizeOptions: string[];
  videoUrl?: string | null;
  careInstructions: string;
  estimatedDeliveryDays: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  isDemo: boolean;
  popularityScore: number;
  stockQuantity: number;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  images: DemoProductImage[];
  createdAt: string;
}

export interface DemoMetalRate {
  id: string;
  metalKey: keyof MetalRateMap;
  label: string;
  ratePerGram: number;
  previousRatePerGram: number;
  source: "MANUAL" | "API";
  updatedBy: string;
  isDemo: boolean;
  updatedAt: string;
}

export interface DemoMetalRateHistory {
  id: string;
  metalKey: keyof MetalRateMap;
  ratePerGram: number;
  source: "MANUAL" | "API";
  note?: string;
  updatedBy: string;
  recordedAt: string;
}

export interface DemoBanner {
  id: string;
  title: string;
  subtitle: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DemoCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface DemoReview {
  id: string;
  productId?: string | null;
  productName?: string | null;
  userId?: string | null;
  customerName: string;
  city?: string;
  rating: number;
  title?: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isFeaturedTestimonial: boolean;
  createdAt: string;
}

export interface DemoStoreLocation {
  id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  openingHours: string;
  mapEmbedUrl: string;
  directionsUrl: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface DemoFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  preferredLanguage: "en" | "mr";
  rewardPoints: number;
  kycVerified: boolean;
  createdAt: string;
  addresses: DemoAddress[];
  wishlistProductIds: string[];
}

export interface DemoAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault: boolean;
}

export interface DemoOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  selectedSize?: string;
  quantity: number;
  metalRatePerGram: number;
  metalValue: number;
  makingCharges: number;
  stoneCharges: number;
  gstAmount: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DemoOrder {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "RAZORPAY" | "UPI" | "CARD" | "NET_BANKING" | "COD";
  providerOrderId?: string;
  providerPaymentId?: string;
  subtotal: number;
  makingChargesTotal: number;
  stoneChargesTotal: number;
  discountAmount: number;
  shippingCharges: number;
  gstAmount: number;
  cardFeeAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  invoiceNumber?: string;
  awbNumber?: string;
  courierName?: string;
  trackingUrl?: string;
  notes?: string;
  items: DemoOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DemoReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  userId?: string | null;
  reason: string;
  details?: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";
  refundAmount?: number;
  createdAt: string;
}

export interface DemoContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  productSku?: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface SiteSettingsConfig {
  businessName: string;
  tagline: string;
  logoUrl: string;
  currency: string;
  country: string;
  timezone: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  gstin: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingCharge: number;
  codEnabled: boolean;
  cardFeeMdrPercent: number;
  goldSavingSchemeEnabled: boolean;
  aadhaarKycEnabled: boolean;
  announcementBarText: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  aboutHeadline: string;
  aboutStory: string;
  verifiedTrustBadges: {
    title: string;
    description: string;
    verified: boolean;
  }[];
  policies: {
    privacy: string;
    terms: string;
    shipping: string;
    returns: string;
    refund: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export const INITIAL_SITE_SETTINGS: SiteSettingsConfig = {
  businessName: "Chintamani Jewellers",
  tagline: "Timeless Jewellery, Beautiful Memories",
  logoUrl: "/images/brand-crest.svg",
  currency: "INR",
  country: "India",
  timezone: "Asia/Kolkata",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210",
  email: "care@chintamanijewellers.example",
  address:
    "Shop No. 6, Bhairvnath Trust / Samarath Heights (Configurable in Admin), Kedgaon, Ahilyanagar, Maharashtra 414005",
  gstin: "27AAACX0000A1Z5 (Demo Placeholder)",
  freeShippingEnabled: true,
  freeShippingThreshold: 25000,
  standardShippingCharge: 450,
  codEnabled: false,
  cardFeeMdrPercent: 0,
  goldSavingSchemeEnabled: false,
  aadhaarKycEnabled: false,
  announcementBarText:
    "Demonstration Storefront • Transparent Weight & Making Charges • Insured Pan-India Delivery",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  aboutHeadline: "Crafting Memories Through Beautiful Jewellery",
  aboutStory:
    "Rooted in the heritage of Ahilyanagar, Chintamani Jewellers blends traditional Maharashtrian karigari with contemporary fine jewellery design. Every creation is crafted with transparent weight disclosure, detailed making-charge clarity, and attentive personal service for weddings, milestones, and everyday elegance.",
  verifiedTrustBadges: [
    {
      title: "Certified Jewellery",
      description:
        "Hallmarked purity & certified diamonds (configure verified BIS/IGI credentials in Admin).",
      verified: true,
    },
    {
      title: "Transparent Pricing",
      description:
        "Clear itemised breakdown of metal value, making charges, stone charges, and 3% GST.",
      verified: true,
    },
    {
      title: "Quality Craftsmanship",
      description:
        "Hand-finished by master artisans with strict inspection for finish, clasp security, and polish.",
      verified: true,
    },
    {
      title: "Secure Payments",
      description:
        "Verified Razorpay, UPI, Net Banking, and Card checkout with server-side signature validation.",
      verified: true,
    },
    {
      title: "Customer Support",
      description:
        "Dedicated WhatsApp and showroom assistance for sizing, custom orders, and post-purchase care.",
      verified: true,
    },
    {
      title: "Trusted Jewellery Store",
      description:
        "Serving families across Ahilyanagar and Maharashtra with honest guidance and transparent billing.",
      verified: true,
    },
  ],
  policies: {
    privacy:
      "Chintamani Jewellers respects your privacy and handles personal data in accordance with applicable Indian data protection laws (including DPDP Act 2023 guidelines once reviewed by legal counsel). We collect only necessary contact, shipping, and order verification details.",
    terms:
      "All jewellery prices are dynamically calculated from the current configured metal rate, net weight, making charges, stone charges, and applicable GST. Orders are confirmed only upon verified payment confirmation.",
    shipping:
      "Orders are dispatched via insured jewellery logistics partners. Standard delivery takes 4–7 business days depending on PIN code and sizing customisation.",
    returns:
      "Return & exchange eligibility is subject to the store's verified inspection policy. Please contact our showroom team within the configured window with your original tax invoice.",
    refund:
      "Approved refunds are processed back to the original payment method within 5–7 business days after quality inspection.",
  },
  seo: {
    metaTitle:
      "Chintamani Jewellers | Fine Gold, Diamond, Silver & Platinum Jewellery",
    metaDescription:
      "Explore handcrafted 22KT gold, IGI-style diamond, silver, and platinum jewellery from Chintamani Jewellers, Ahilyanagar. Transparent pricing and insured delivery.",
  },
};

export const INITIAL_CATEGORIES: DemoCategory[] = [
  {
    id: "cat-gold-rings",
    name: "Gold Rings",
    nameMr: "सोन्याच्या अंगठ्या",
    slug: "gold-rings",
    description: "Classic & contemporary 22KT gold rings for daily wear and celebrations.",
    imageUrl: "/images/cat-gold-rings.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-gold-necklaces",
    name: "Gold Necklaces",
    nameMr: "सोन्याचे नेकलेस",
    slug: "gold-necklaces",
    description: "Regal temple harams, chokers, and bridal gold necklaces.",
    imageUrl: "/images/cat-gold-necklace.jpg",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-gold-chains",
    name: "Gold Chains",
    nameMr: "सोन्याच्या चेन",
    slug: "gold-chains",
    description: "Box, rope, and Italian-finish 22KT gold chains.",
    imageUrl: "/images/cat-gold-necklace.jpg",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-gold-earrings",
    name: "Gold Earrings",
    nameMr: "सोन्याचे कानातले",
    slug: "gold-earrings",
    description: "Jhumkas, chandbalis, studs, and lightweight daily drops.",
    imageUrl: "/images/hero-bridal.jpg",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-bangles",
    name: "Bangles",
    nameMr: "सोन्याच्या बांगड्या",
    slug: "bangles",
    description: "Hand-carved kangan, patla, and bridal gold bangles.",
    imageUrl: "/images/cat-bangles.jpg",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    nameMr: "ब्रेसलेट",
    slug: "bracelets",
    description: "Delicate tennis bracelets, kada, and modern wristwear.",
    imageUrl: "/images/cat-bangles.jpg",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "cat-mangalsutra",
    name: "Mangalsutra",
    nameMr: "मंगळसूत्र",
    slug: "mangalsutra",
    description: "Traditional vati and modern diamond-studded mangalsutras.",
    imageUrl: "/images/cat-mangalsutra.jpg",
    sortOrder: 7,
    isActive: true,
  },
  {
    id: "cat-diamond-jewellery",
    name: "Diamond Jewellery",
    nameMr: "हिऱ्याचे दागिने",
    slug: "diamond-jewellery",
    description: "Solitaire rings, diamond pendants, and 18KT fine jewellery.",
    imageUrl: "/images/hero-diamond.jpg",
    sortOrder: 8,
    isActive: true,
  },
  {
    id: "cat-silver-jewellery",
    name: "Silver Jewellery",
    nameMr: "चांदीचे दागिने",
    slug: "silver-jewellery",
    description: "925 sterling silver anklets, toe rings, and gifting articles.",
    imageUrl: "/images/hero-diamond.jpg",
    sortOrder: 9,
    isActive: true,
  },
  {
    id: "cat-platinum-jewellery",
    name: "Platinum Jewellery",
    nameMr: "प्लॅटिनम दागिने",
    slug: "platinum-jewellery",
    description: "950 Platinum couple bands and minimalist luxury.",
    imageUrl: "/images/cat-gold-rings.jpg",
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "cat-gold-coins",
    name: "Gold Coins",
    nameMr: "सोन्याची नाणी",
    slug: "gold-coins",
    description: "24KT 999 purity Lakshmi & plain investment gold coins.",
    imageUrl: "/images/cat-bangles.jpg",
    sortOrder: 11,
    isActive: true,
  },
  {
    id: "cat-silver-coins",
    name: "Silver Coins",
    nameMr: "चांदीची नाणी",
    slug: "silver-coins",
    description: "999 fine silver auspicious coins for gifting and puja.",
    imageUrl: "/images/cat-gold-rings.jpg",
    sortOrder: 12,
    isActive: true,
  },
];

export const INITIAL_METAL_RATES: DemoMetalRate[] = [
  {
    id: "rate-24k",
    metalKey: "GOLD_24KT",
    label: "24KT Gold (999)",
    ratePerGram: 7850,
    previousRatePerGram: 7810,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
  {
    id: "rate-22k",
    metalKey: "GOLD_22KT",
    label: "22KT Gold (916)",
    ratePerGram: 7195,
    previousRatePerGram: 7160,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
  {
    id: "rate-18k",
    metalKey: "GOLD_18KT",
    label: "18KT Gold (750)",
    ratePerGram: 5890,
    previousRatePerGram: 5865,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
  {
    id: "rate-14k",
    metalKey: "GOLD_14KT",
    label: "14KT Gold (585)",
    ratePerGram: 4580,
    previousRatePerGram: 4560,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
  {
    id: "rate-silver",
    metalKey: "SILVER_999",
    label: "Silver (999)",
    ratePerGram: 96,
    previousRatePerGram: 95,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
  {
    id: "rate-platinum",
    metalKey: "PLATINUM_950",
    label: "Platinum (950)",
    ratePerGram: 3150,
    previousRatePerGram: 3150,
    source: "MANUAL",
    updatedBy: "Demo Admin",
    isDemo: true,
    updatedAt: "2026-11-26T09:30:00+05:30",
  },
];

export const INITIAL_BANNERS: DemoBanner[] = [
  {
    id: "banner-0",
    title: "Festive Heritage 2026",
    subtitle: "CHINTAMANI SIGNATURE ATELIER",
    headline: "Elegance That Lasts Forever",
    description:
      "Discover exquisite jewellery collections crafted to celebrate your most precious moments.",
    ctaText: "Explore Collection",
    ctaLink: "/collections",
    secondaryCtaText: "Shop Now",
    secondaryCtaLink: "/jewellery",
    desktopImageUrl: "/images/hero-festive-family.jpg",
    mobileImageUrl: "/images/hero-festive-family.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "banner-1",
    title: "Bridal & Heritage 2026",
    subtitle: "22KT BRIDAL & TEMPLE GOLD",
    headline: "Timeless Bridal Finery",
    description:
      "Handcrafted temple harams, chokers, and heirloom bangles for unforgettable celebrations.",
    ctaText: "Shop Bridal",
    ctaLink: "/jewellery/gold",
    secondaryCtaText: "View All",
    secondaryCtaLink: "/jewellery",
    desktopImageUrl: "/images/hero-bridal.jpg",
    mobileImageUrl: "/images/hero-bridal.jpg",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "banner-2",
    title: "Modern Diamond Edit",
    subtitle: "18KT ROSE & YELLOW GOLD",
    headline: "Radiance In Every Facet",
    description:
      "Lightweight everyday diamonds and solitaire rings designed for modern Indian elegance.",
    ctaText: "Shop Diamonds",
    ctaLink: "/jewellery/diamond",
    secondaryCtaText: "View All",
    secondaryCtaLink: "/jewellery",
    desktopImageUrl: "/images/hero-diamond.jpg",
    mobileImageUrl: "/images/hero-diamond.jpg",
    sortOrder: 2,
    isActive: true,
  },
];

export const INITIAL_PRODUCTS: DemoProduct[] = [
  {
    id: "prod-1",
    name: "Rajwadi Temple Rani Haar (Demo)",
    nameMr: "राजवाडी टेम्पल राणी हार",
    slug: "rajwadi-temple-rani-haar-demo",
    sku: "CJ-GN-1001",
    shortDescription:
      "Handcrafted 22KT gold bridal temple necklace with antique matte finish.",
    description:
      "Demonstration Product: A regal 22KT gold Rani Haar inspired by classic temple architecture, finished with delicate gold ghungroo drops and adjustable dori.",
    metalType: "GOLD",
    purity: "22KT",
    grossWeightGrams: 42.5,
    netWeightGrams: 41.2,
    stoneWeightGrams: 1.3,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 13,
    stoneCharges: 3200,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Wedding Collection", "Bridal Jewellery", "Traditional Jewellery", "Festive Collection"],
    collectionTag: "Bridal Collection",
    sizeOptions: ["18 Inch", "20 Inch", "22 Inch"],
    careInstructions:
      "Store separately in the provided soft velvet pouch. Keep away from perfumes, hairspray, and moisture.",
    estimatedDeliveryDays: 7,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    isDemo: true,
    popularityScore: 98,
    stockQuantity: 4,
    categoryId: "cat-gold-necklaces",
    categorySlug: "gold-necklaces",
    categoryName: "Gold Necklaces",
    images: [
      {
        id: "img-1a",
        url: "/images/cat-gold-necklace.jpg",
        altText: "Rajwadi Temple Rani Haar 22KT Gold Necklace",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-1b",
        url: "/images/hero-bridal.jpg",
        altText: "Rajwadi Temple Rani Haar Bridal Styling",
        sortOrder: 2,
        isPrimary: false,
      },
    ],
    createdAt: "2026-11-10T10:00:00+05:30",
  },
  {
    id: "prod-2",
    name: "Aarohi Solitaire Diamond Ring (Demo)",
    nameMr: "आरोही सॉलिटेअर डायमंड रिंग",
    slug: "aarohi-solitaire-diamond-ring-demo",
    sku: "CJ-DR-2004",
    shortDescription:
      "18KT yellow gold ring crowned with a brilliant-cut EF-VVS solitaire accent.",
    description:
      "Demonstration Product: Crafted in 18KT gold with precision four-prong setting, perfect for engagements, anniversaries, and timeless gifting.",
    metalType: "DIAMOND",
    purity: "18KT",
    diamondQuality: "EF-VVS1 (0.45 ct)",
    grossWeightGrams: 4.15,
    netWeightGrams: 3.9,
    stoneWeightGrams: 0.25,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 13,
    stoneCharges: 36500,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Wedding Collection", "Anniversary Gifts", "Office Wear", "Birthday Gifts"],
    collectionTag: "Diamond Collection",
    sizeOptions: ["10", "12", "14", "16", "18"],
    careInstructions:
      "Clean gently with lukewarm water and a soft brush. Avoid wearing during heavy manual work.",
    estimatedDeliveryDays: 5,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 95,
    stockQuantity: 6,
    categoryId: "cat-diamond-jewellery",
    categorySlug: "diamond-jewellery",
    categoryName: "Diamond Jewellery",
    images: [
      {
        id: "img-2a",
        url: "/images/hero-diamond.jpg",
        altText: "Aarohi Solitaire Diamond Ring in 18KT Gold",
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: "img-2b",
        url: "/images/cat-gold-rings.jpg",
        altText: "Aarohi Diamond Ring Alternate Angle",
        sortOrder: 2,
        isPrimary: false,
      },
    ],
    createdAt: "2026-11-18T11:30:00+05:30",
  },
  {
    id: "prod-3",
    name: "Saubhagya Diamond Vati Mangalsutra (Demo)",
    nameMr: "सौभाग्य डायमंड वाटी मंगळसूत्र",
    slug: "saubhagya-diamond-vati-mangalsutra-demo",
    sku: "CJ-MS-3002",
    shortDescription:
      "22KT gold & black-bead mangalsutra with contemporary diamond floral centrepiece.",
    description:
      "Demonstration Product: Designed for the modern Maharashtrian bride, pairing classic black beads in 22KT gold with an everyday-wearable floral pendant.",
    metalType: "GOLD",
    purity: "22KT",
    diamondQuality: "GH-VS (0.18 ct)",
    grossWeightGrams: 11.8,
    netWeightGrams: 10.9,
    stoneWeightGrams: 0.9,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 11,
    stoneCharges: 11500,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Wedding Collection", "Daily Wear", "Office Wear", "Bridal Jewellery"],
    collectionTag: "Everyday Luxury",
    sizeOptions: ["16 Inch", "18 Inch"],
    careInstructions:
      "Lay flat in a fabric-lined box to avoid kinking the delicate black-bead chain.",
    estimatedDeliveryDays: 5,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 94,
    stockQuantity: 8,
    categoryId: "cat-mangalsutra",
    categorySlug: "mangalsutra",
    categoryName: "Mangalsutra",
    images: [
      {
        id: "img-3a",
        url: "/images/cat-mangalsutra.jpg",
        altText: "Saubhagya Diamond Vati Mangalsutra",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-20T09:15:00+05:30",
  },
  {
    id: "prod-4",
    name: "Kundan Filigree Gold Kangan Pair (Demo)",
    nameMr: "कुंदन फिलिग्री सोन्याचे कंगण",
    slug: "kundan-filigree-gold-kangan-pair-demo",
    sku: "CJ-BG-4005",
    shortDescription:
      "Pair of 22KT gold carved bridal bangles with intricate rawa filigree.",
    description:
      "Demonstration Product: Twin 22KT gold kangan bangles crafted with heritage filigree and secure screw-clasp opening.",
    metalType: "GOLD",
    purity: "22KT",
    grossWeightGrams: 32.0,
    netWeightGrams: 32.0,
    stoneWeightGrams: 0,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 13,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Bridal Jewellery", "Festive Collection", "Traditional Jewellery"],
    collectionTag: "Traditional Gold Collection",
    sizeOptions: ["2-4", "2-6", "2-8"],
    careInstructions: "Wipe with a dry microfibre cloth after each wear.",
    estimatedDeliveryDays: 6,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    isPublished: true,
    isDemo: true,
    popularityScore: 89,
    stockQuantity: 5,
    categoryId: "cat-bangles",
    categorySlug: "bangles",
    categoryName: "Bangles",
    images: [
      {
        id: "img-4a",
        url: "/images/cat-bangles.jpg",
        altText: "Kundan Filigree Gold Kangan Pair",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-08T14:20:00+05:30",
  },
  {
    id: "prod-5",
    name: "Meenakari Heritage Gold Ring (Demo)",
    nameMr: "मीनाकारी हेरिटेज सोन्याची अंगठी",
    slug: "meenakari-heritage-gold-ring-demo",
    sku: "CJ-GR-1102",
    shortDescription:
      "22KT gold sculpted statement ring with subtle heritage detailing.",
    description:
      "Demonstration Product: Lightweight 22KT gold ring crafted for everyday grace and festive celebrations.",
    metalType: "GOLD",
    purity: "22KT",
    grossWeightGrams: 4.8,
    netWeightGrams: 4.8,
    stoneWeightGrams: 0,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 11,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Daily Wear", "Office Wear", "Birthday Gifts"],
    collectionTag: "Lightweight Jewellery",
    sizeOptions: ["10", "12", "14", "16"],
    careInstructions: "Remove before washing hands with harsh soaps.",
    estimatedDeliveryDays: 4,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 82,
    stockQuantity: 12,
    categoryId: "cat-gold-rings",
    categorySlug: "gold-rings",
    categoryName: "Gold Rings",
    images: [
      {
        id: "img-5a",
        url: "/images/cat-gold-rings.jpg",
        altText: "Meenakari Heritage Gold Ring",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-22T12:00:00+05:30",
  },
  {
    id: "prod-6",
    name: "Royal Box Link 22KT Gold Chain (Demo)",
    nameMr: "रॉयल बॉक्स लिंक सोन्याची चेन",
    slug: "royal-box-link-22kt-gold-chain-demo",
    sku: "CJ-GC-1208",
    shortDescription:
      "Sturdy Italian-finish 22KT gold box chain suitable for daily wear.",
    description:
      "Demonstration Product: Precision-linked 22KT gold chain with high-polish finish and reinforced lobster clasp.",
    metalType: "GOLD",
    purity: "22KT",
    grossWeightGrams: 14.5,
    netWeightGrams: 14.5,
    stoneWeightGrams: 0,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 11,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Daily Wear", "Office Wear", "Birthday Gifts", "Anniversary Gifts"],
    collectionTag: "Everyday Luxury",
    sizeOptions: ["20 Inch", "22 Inch", "24 Inch"],
    careInstructions: "Store unclasped and flat to prevent tangles.",
    estimatedDeliveryDays: 4,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    isPublished: true,
    isDemo: true,
    popularityScore: 87,
    stockQuantity: 9,
    categoryId: "cat-gold-chains",
    categorySlug: "gold-chains",
    categoryName: "Gold Chains",
    images: [
      {
        id: "img-6a",
        url: "/images/cat-gold-necklace.jpg",
        altText: "Royal Box Link 22KT Gold Chain",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-05T16:10:00+05:30",
  },
  {
    id: "prod-7",
    name: "Chandrika Temple Gold Jhumkas (Demo)",
    nameMr: "चंद्रिका टेम्पल सोन्याचे झुमके",
    slug: "chandrika-temple-gold-jhumkas-demo",
    sku: "CJ-GE-1305",
    shortDescription:
      "22KT gold sculpted dome jhumkas with pearl-drop accents.",
    description:
      "Demonstration Product: Traditional festive jhumkas crafted in 22KT gold with balanced weight distribution for comfortable all-day wear.",
    metalType: "GOLD",
    purity: "22KT",
    grossWeightGrams: 12.4,
    netWeightGrams: 11.9,
    stoneWeightGrams: 0.5,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 13,
    stoneCharges: 1400,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Festive Collection", "Wedding Collection", "Traditional Jewellery"],
    collectionTag: "Traditional Gold Collection",
    sizeOptions: ["Standard"],
    careInstructions: "Keep away from moisture and store in padded box.",
    estimatedDeliveryDays: 5,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 91,
    stockQuantity: 7,
    categoryId: "cat-gold-earrings",
    categorySlug: "gold-earrings",
    categoryName: "Gold Earrings",
    images: [
      {
        id: "img-7a",
        url: "/images/hero-bridal.jpg",
        altText: "Chandrika Temple Gold Jhumkas",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-23T15:00:00+05:30",
  },
  {
    id: "prod-8",
    name: "Noor 18KT Rose Gold Diamond Bracelet (Demo)",
    nameMr: "नूर डायमंड ब्रेसलेट",
    slug: "noor-18kt-rose-gold-diamond-bracelet-demo",
    sku: "CJ-BR-2109",
    shortDescription:
      "Sleek 18KT gold oval-link bracelet accented with natural diamonds.",
    description:
      "Demonstration Product: Contemporary everyday luxury bracelet in 18KT gold with 0.35 ct EF-VVS diamonds.",
    metalType: "DIAMOND",
    purity: "18KT",
    diamondQuality: "EF-VVS (0.35 ct)",
    grossWeightGrams: 8.6,
    netWeightGrams: 8.2,
    stoneWeightGrams: 0.4,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 13,
    stoneCharges: 28000,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Office Wear", "Anniversary Gifts", "Birthday Gifts", "Daily Wear"],
    collectionTag: "Everyday Luxury",
    sizeOptions: ["6.5 Inch", "7.0 Inch"],
    careInstructions: "Check clasp lock before wearing; wipe gently after use.",
    estimatedDeliveryDays: 5,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 84,
    stockQuantity: 5,
    categoryId: "cat-bracelets",
    categorySlug: "bracelets",
    categoryName: "Bracelets",
    images: [
      {
        id: "img-8a",
        url: "/images/hero-diamond.jpg",
        altText: "Noor 18KT Rose Gold Diamond Bracelet",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-24T10:45:00+05:30",
  },
  {
    id: "prod-9",
    name: "950 Platinum Eternity Couple Band (Demo)",
    nameMr: "प्लॅटिनम कपल बँड",
    slug: "950-platinum-eternity-couple-band-demo",
    sku: "CJ-PL-5001",
    shortDescription:
      "Brushed & mirror-bevelled 950 Platinum band for timeless commitments.",
    description:
      "Demonstration Product: Crafted in 950 pure platinum with comfort-fit interior profile.",
    metalType: "PLATINUM",
    purity: "950 Platinum",
    grossWeightGrams: 6.2,
    netWeightGrams: 6.2,
    stoneWeightGrams: 0,
    makingChargeType: "PER_GRAM",
    makingChargeValue: 650,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Wedding Collection", "Anniversary Gifts", "Office Wear"],
    collectionTag: "Everyday Luxury",
    sizeOptions: ["12", "14", "16", "18", "20"],
    careInstructions: "Polish occasionally with a platinum-safe cloth.",
    estimatedDeliveryDays: 6,
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: false,
    isPublished: true,
    isDemo: true,
    popularityScore: 79,
    stockQuantity: 10,
    categoryId: "cat-platinum-jewellery",
    categorySlug: "platinum-jewellery",
    categoryName: "Platinum Jewellery",
    images: [
      {
        id: "img-9a",
        url: "/images/cat-gold-rings.jpg",
        altText: "950 Platinum Eternity Couple Band",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-12T13:30:00+05:30",
  },
  {
    id: "prod-10",
    name: "925 Sterling Silver Ghungroo Payal (Demo)",
    nameMr: "९२५ चांदीचे पैंजण",
    slug: "925-sterling-silver-ghungroo-payal-demo",
    sku: "CJ-SV-6003",
    shortDescription:
      "Handcrafted 925 sterling silver anklets with soft musical ghungroos.",
    description:
      "Demonstration Product: Authentic 925 silver anklets with antique oxidised accents and S-hook closure.",
    metalType: "SILVER",
    purity: "925 Silver",
    grossWeightGrams: 28.0,
    netWeightGrams: 28.0,
    stoneWeightGrams: 0,
    makingChargeType: "PER_GRAM",
    makingChargeValue: 45,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7113",
    occasions: ["Festive Collection", "Daily Wear", "Birthday Gifts"],
    collectionTag: "Lightweight Jewellery",
    sizeOptions: ["9.5 Inch", "10.0 Inch", "10.5 Inch"],
    careInstructions: "Store in an airtight zip pouch to prevent natural tarnishing.",
    estimatedDeliveryDays: 4,
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 76,
    stockQuantity: 15,
    categoryId: "cat-silver-jewellery",
    categorySlug: "silver-jewellery",
    categoryName: "Silver Jewellery",
    images: [
      {
        id: "img-10a",
        url: "/images/cat-bangles.jpg",
        altText: "925 Sterling Silver Ghungroo Payal",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-19T16:00:00+05:30",
  },
  {
    id: "prod-11",
    name: "24KT 999 Lakshmi Gold Coin - 5g (Demo)",
    nameMr: "२४ कॅरेट लक्ष्मी सोन्याचे नाणे (५ ग्रॅम)",
    slug: "24kt-999-lakshmi-gold-coin-5g-demo",
    sku: "CJ-GC-9005",
    shortDescription:
      "Tamper-evident certicard 24KT 999 purity 5-gram auspicious gold coin.",
    description:
      "Demonstration Product: Ideal for Dhanteras, Akshaya Tritiya, weddings, and auspicious gifting.",
    metalType: "BULLION",
    purity: "24KT",
    grossWeightGrams: 5.0,
    netWeightGrams: 5.0,
    stoneWeightGrams: 0,
    makingChargeType: "PERCENTAGE",
    makingChargeValue: 4,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7118",
    occasions: ["Festive Collection", "Wedding Collection", "Anniversary Gifts"],
    collectionTag: "Bullion",
    sizeOptions: ["5 Grams"],
    careInstructions: "Keep sealed inside the tamper-evident certicard.",
    estimatedDeliveryDays: 3,
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    isPublished: true,
    isDemo: true,
    popularityScore: 93,
    stockQuantity: 25,
    categoryId: "cat-gold-coins",
    categorySlug: "gold-coins",
    categoryName: "Gold Coins",
    images: [
      {
        id: "img-11a",
        url: "/images/cat-bangles.jpg",
        altText: "24KT 999 Lakshmi Gold Coin 5g",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-02T09:00:00+05:30",
  },
  {
    id: "prod-12",
    name: "999 Fine Silver Coin - 20g (Demo)",
    nameMr: "९९९ शुद्ध चांदीचे नाणे (२० ग्रॅम)",
    slug: "999-fine-silver-coin-20g-demo",
    sku: "CJ-SC-9520",
    shortDescription:
      "Pure 999 silver 20-gram minted coin in presentation velvet box.",
    description:
      "Demonstration Product: Pure 999 silver coin crafted for festivals, baby showers, and corporate gifting.",
    metalType: "SILVER",
    purity: "999 Silver",
    grossWeightGrams: 20.0,
    netWeightGrams: 20.0,
    stoneWeightGrams: 0,
    makingChargeType: "FIXED",
    makingChargeValue: 350,
    stoneCharges: 0,
    additionalCharges: 0,
    gstPercent: 3,
    hsnCode: "7118",
    occasions: ["Festive Collection", "Birthday Gifts"],
    collectionTag: "Bullion",
    sizeOptions: ["20 Grams"],
    careInstructions: "Store in capsule inside presentation box.",
    estimatedDeliveryDays: 3,
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    isPublished: true,
    isDemo: true,
    popularityScore: 80,
    stockQuantity: 40,
    categoryId: "cat-silver-coins",
    categorySlug: "silver-coins",
    categoryName: "Silver Coins",
    images: [
      {
        id: "img-12a",
        url: "/images/cat-gold-rings.jpg",
        altText: "999 Fine Silver Coin 20g",
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    createdAt: "2026-11-21T10:00:00+05:30",
  },
];

export const INITIAL_COUPONS: DemoCoupon[] = [
  {
    id: "coup-1",
    code: "FESTIVE5",
    description: "5% off on making charges (up to ₹2,500) on orders above ₹25,000",
    discountType: "PERCENTAGE",
    discountValue: 5,
    minOrderValue: 25000,
    maxDiscount: 2500,
    usageLimit: 500,
    usedCount: 12,
    expiresAt: "2027-12-31T23:59:59+05:30",
    isActive: true,
  },
  {
    id: "coup-2",
    code: "WELCOME1000",
    description: "Flat ₹1,000 off on orders above ₹40,000",
    discountType: "FLAT",
    discountValue: 1000,
    minOrderValue: 40000,
    maxDiscount: 1000,
    usageLimit: 200,
    usedCount: 5,
    expiresAt: "2027-12-31T23:59:59+05:30",
    isActive: true,
  },
];

export const INITIAL_REVIEWS: DemoReview[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    productName: "Rajwadi Temple Rani Haar (Demo)",
    customerName: "Priya Deshmukh",
    city: "Ahilyanagar",
    rating: 5,
    title: "Exceptional Bridal Craftsmanship",
    comment:
      "The detailing on the temple necklace and the transparent weight & making-charge breakdown gave our family complete confidence.",
    status: "APPROVED",
    isFeaturedTestimonial: true,
    createdAt: "2026-11-10T14:00:00+05:30",
  },
  {
    id: "rev-2",
    productId: "prod-3",
    productName: "Saubhagya Diamond Vati Mangalsutra (Demo)",
    customerName: "Snehal Kulkarni",
    city: "Pune",
    rating: 5,
    title: "Perfect Blend of Tradition & Comfort",
    comment:
      "I wear my mangalsutra to the office every day. Lightweight, elegant, and delivered safely in insured packaging.",
    status: "APPROVED",
    isFeaturedTestimonial: true,
    createdAt: "2026-11-15T11:20:00+05:30",
  },
  {
    id: "rev-3",
    productId: "prod-2",
    productName: "Aarohi Solitaire Diamond Ring (Demo)",
    customerName: "Rohan Joshi",
    city: "Nashik",
    rating: 5,
    title: "Transparent Billing & Warm Guidance",
    comment:
      "Bought an anniversary ring — the team explained 18KT vs 22KT and diamond clarity clearly without any pushy sales.",
    status: "APPROVED",
    isFeaturedTestimonial: true,
    createdAt: "2026-11-19T18:10:00+05:30",
  },
];

export const INITIAL_STORES: DemoStoreLocation[] = [
  {
    id: "store-1",
    name: "Chintamani Jewellers — Ahilyanagar Showroom",
    addressLine:
      "Shop No. 6, Bhairvnath Trust / Samarath Heights (Configurable in Admin), Kedgaon",
    city: "Ahilyanagar",
    state: "Maharashtra",
    pinCode: "414005",
    phone: "+91 98765 43210",
    email: "care@chintamanijewellers.example",
    openingHours: "Mon – Sun: 10:30 AM – 8:30 PM (Closed on Tuesdays if applicable)",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Kedgaon,Ahilyanagar,Maharashtra&output=embed",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kedgaon+Ahilyanagar+Maharashtra",
    isPrimary: true,
    isActive: true,
  },
];

export const INITIAL_FAQS: DemoFaq[] = [
  {
    id: "faq-1",
    category: "Pricing & Purity",
    question: "How is the final price of each jewellery piece calculated?",
    answer:
      "Every product displays an itemised breakdown: (Net Weight × Configured Metal Rate per gram) + Making Charges + Stone/Additional Charges + 3% GST = Final Price.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "faq-2",
    category: "Delivery & Insurance",
    question: "Is online jewellery delivery insured?",
    answer:
      "Yes, all shipments are dispatched in tamper-evident packaging via insured logistics partners with live AWB tracking.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "faq-3",
    category: "Payments",
    question: "What payment methods are accepted?",
    answer:
      "We accept Razorpay, UPI, Credit/Debit Cards, and Net Banking. Cash on Delivery is available only when enabled by store administration.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "faq-4",
    category: "Sizing & Customisation",
    question: "Can I request a custom ring or bangle size?",
    answer:
      "Yes! Select your preferred size on the product page or message us directly via the WhatsApp button for custom sizing.",
    sortOrder: 4,
    isActive: true,
  },
];
