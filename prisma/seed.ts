import { PrismaClient } from "@prisma/client";
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
} from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Chintamani Jewellers PostgreSQL database...");

  const adminEmail =
    process.env.ADMIN_EMAIL || "admin@chintamanijewellers.in";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe@2026!";

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      name: "Store Administrator",
      email: adminEmail.toLowerCase(),
      phone: "+91 98765 43210",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "SUPER_ADMIN",
      adminProfile: {
        create: {
          designation: "Owner & Chief Administrator",
          permissions: ["ALL"],
        },
      },
    },
  });
  console.log("Admin ready:", adminUser.email);

  await prisma.siteSetting.upsert({
    where: { key: "brand_config" },
    update: { valueJson: INITIAL_SITE_SETTINGS as object },
    create: {
      key: "brand_config",
      valueJson: INITIAL_SITE_SETTINGS as object,
    },
  });

  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameMr: cat.nameMr,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        name: cat.name,
        nameMr: cat.nameMr,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
      },
    });
  }

  for (const rate of INITIAL_METAL_RATES) {
    await prisma.metalRate.upsert({
      where: { metalKey: rate.metalKey },
      update: {
        label: rate.label,
        ratePerGram: rate.ratePerGram,
        previousRatePerGram: rate.previousRatePerGram,
        source: rate.source,
        updatedBy: rate.updatedBy,
        isDemo: rate.isDemo,
      },
      create: {
        metalKey: rate.metalKey,
        label: rate.label,
        ratePerGram: rate.ratePerGram,
        previousRatePerGram: rate.previousRatePerGram,
        source: rate.source,
        updatedBy: rate.updatedBy,
        isDemo: rate.isDemo,
      },
    });
  }

  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: {
        id: prod.id,
        name: prod.name,
        nameMr: prod.nameMr,
        slug: prod.slug,
        sku: prod.sku,
        shortDescription: prod.shortDescription,
        description: prod.description,
        metalType: prod.metalType,
        purity: prod.purity,
        diamondQuality: prod.diamondQuality ?? null,
        grossWeightGrams: prod.grossWeightGrams,
        netWeightGrams: prod.netWeightGrams,
        stoneWeightGrams: prod.stoneWeightGrams,
        makingChargeType: prod.makingChargeType,
        makingChargeValue: prod.makingChargeValue,
        stoneCharges: prod.stoneCharges,
        additionalCharges: prod.additionalCharges,
        gstPercent: prod.gstPercent,
        hsnCode: prod.hsnCode,
        occasions: prod.occasions,
        collectionTag: prod.collectionTag ?? null,
        sizeOptions: prod.sizeOptions,
        careInstructions: prod.careInstructions,
        estimatedDeliveryDays: prod.estimatedDeliveryDays,
        isBestSeller: prod.isBestSeller,
        isFeatured: prod.isFeatured,
        isNewArrival: prod.isNewArrival,
        isPublished: prod.isPublished,
        isDemo: prod.isDemo,
        popularityScore: prod.popularityScore,
        categoryId: prod.categoryId,
        images: {
          create: prod.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
          })),
        },
        inventory: {
          create: {
            stockQuantity: prod.stockQuantity,
          },
        },
      },
    });
  }

  for (const coupon of INITIAL_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount ?? null,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        expiresAt: new Date(coupon.expiresAt),
        isActive: coupon.isActive,
      },
    });
  }

  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    for (const banner of INITIAL_BANNERS) {
      await prisma.banner.create({
        data: {
          title: banner.title,
          subtitle: banner.subtitle,
          headline: banner.headline,
          description: banner.description,
          ctaText: banner.ctaText,
          ctaLink: banner.ctaLink,
          secondaryCtaText: banner.secondaryCtaText,
          secondaryCtaLink: banner.secondaryCtaLink,
          desktopImageUrl: banner.desktopImageUrl,
          mobileImageUrl: banner.mobileImageUrl,
          sortOrder: banner.sortOrder,
          isActive: banner.isActive,
        },
      });
    }
  }

  const storeCount = await prisma.storeLocation.count();
  if (storeCount === 0) {
    for (const store of INITIAL_STORES) {
      await prisma.storeLocation.create({ data: store });
    }
  }

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    for (const faq of INITIAL_FAQS) {
      await prisma.faq.create({ data: faq });
    }
  }

  const revCount = await prisma.review.count();
  if (revCount === 0) {
    for (const rev of INITIAL_REVIEWS) {
      await prisma.review.create({
        data: {
          productId: rev.productId ?? null,
          customerName: rev.customerName,
          city: rev.city ?? null,
          rating: rev.rating,
          title: rev.title ?? null,
          comment: rev.comment,
          status: rev.status,
          isFeaturedTestimonial: rev.isFeaturedTestimonial,
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
