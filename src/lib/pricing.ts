export type MetalTypeKey = "GOLD" | "DIAMOND" | "SILVER" | "PLATINUM" | "BULLION";
export type MakingChargeMode = "PERCENTAGE" | "PER_GRAM" | "FIXED";

export interface MetalRateMap {
  GOLD_24KT: number;
  GOLD_22KT: number;
  GOLD_18KT: number;
  GOLD_14KT: number;
  SILVER_999: number;
  PLATINUM_950: number;
}

export interface PriceCalculationInput {
  metalType: MetalTypeKey;
  purity: string;
  netWeightGrams: number;
  makingChargeType: MakingChargeMode;
  makingChargeValue: number;
  stoneCharges?: number;
  additionalCharges?: number;
  gstPercent?: number;
  fixedPriceOverride?: number | null;
  rates: MetalRateMap;
}

export interface PriceBreakdown {
  ratePerGram: number;
  metalValue: number;
  makingCharges: number;
  stoneCharges: number;
  additionalCharges: number;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  finalPrice: number;
}

/**
 * Resolves the applicable per-gram rate from the configured MetalRateMap
 * based on metal type and purity string.
 */
export function resolveMetalRatePerGram(
  metalType: MetalTypeKey,
  purity: string,
  rates: MetalRateMap
): number {
  const normalized = purity.toUpperCase().replace(/\s+/g, "");
  if (metalType === "SILVER") {
    return rates.SILVER_999;
  }
  if (metalType === "PLATINUM") {
    return rates.PLATINUM_950;
  }
  if (normalized.includes("24K")) return rates.GOLD_24KT;
  if (normalized.includes("22K")) return rates.GOLD_22KT;
  if (normalized.includes("18K")) return rates.GOLD_18KT;
  if (normalized.includes("14K")) return rates.GOLD_14KT;
  if (metalType === "DIAMOND") return rates.GOLD_18KT;
  if (metalType === "BULLION") return rates.GOLD_24KT;
  return rates.GOLD_22KT;
}

/**
 * Computes transparent Indian jewellery price breakdown:
 * Metal Value + Making Charges + Stone Charges + Additional Charges + GST = Final Price.
 */
export function calculateJewelleryPrice(input: PriceCalculationInput): PriceBreakdown {
  const gstPercent = input.gstPercent ?? 3;
  const stoneCharges = Math.max(0, input.stoneCharges ?? 0);
  const additionalCharges = Math.max(0, input.additionalCharges ?? 0);
  const ratePerGram = resolveMetalRatePerGram(input.metalType, input.purity, input.rates);

  if (input.fixedPriceOverride && input.fixedPriceOverride > 0) {
    const subtotal = Math.round(input.fixedPriceOverride / (1 + gstPercent / 100));
    const gstAmount = Math.round(input.fixedPriceOverride - subtotal);
    return {
      ratePerGram,
      metalValue: subtotal,
      makingCharges: 0,
      stoneCharges: 0,
      additionalCharges: 0,
      subtotal,
      gstPercent,
      gstAmount,
      finalPrice: Math.round(input.fixedPriceOverride),
    };
  }

  const metalValue = Math.round(Math.max(0, input.netWeightGrams) * ratePerGram);

  let makingCharges = 0;
  if (input.makingChargeType === "PERCENTAGE") {
    makingCharges = Math.round((metalValue * Math.max(0, input.makingChargeValue)) / 100);
  } else if (input.makingChargeType === "PER_GRAM") {
    makingCharges = Math.round(Math.max(0, input.netWeightGrams) * Math.max(0, input.makingChargeValue));
  } else {
    makingCharges = Math.round(Math.max(0, input.makingChargeValue));
  }

  const subtotal = metalValue + makingCharges + stoneCharges + additionalCharges;
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const finalPrice = subtotal + gstAmount;

  return {
    ratePerGram,
    metalValue,
    makingCharges,
    stoneCharges,
    additionalCharges,
    subtotal,
    gstPercent,
    gstAmount,
    finalPrice,
  };
}

/**
 * Formats a number in Indian Rupee (INR) format with grouping (e.g., ₹1,24,500).
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
