"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { EnrichedProduct } from "@/lib/store";

export interface CartItemUI {
  id: string;
  productId: string;
  slug: string;
  name: string;
  sku: string;
  imageUrl: string;
  metalType: string;
  purity: string;
  netWeightGrams: number;
  selectedSize: string;
  sizeOptions: string[];
  quantity: number;
  stockQuantity: number;
  unitBreakdown: {
    ratePerGram: number;
    metalValue: number;
    makingCharges: number;
    stoneCharges: number;
    additionalCharges: number;
    subtotal: number;
    gstPercent: number;
    gstAmount: number;
    finalPrice: number;
  };
  lineTotal: number;
}

export interface CartState {
  items: CartItemUI[];
  itemCount: number;
  subtotalBeforeGst: number;
  gstTotal: number;
  itemsGrossTotal: number;
  discountAmount: number;
  shippingCharges: number;
  finalTotal: number;
  appliedCoupon: { code: string; description: string } | null;
  couponError: string | null;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
}

export interface UserSessionUI {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  preferredLanguage: "en" | "mr";
  rewardPoints: number;
  kycVerified: boolean;
  wishlistProductIds: string[];
}

interface StoreContextValue {
  cart: CartState;
  user: UserSessionUI | null;
  lang: "en" | "mr";
  setLang: (lang: "en" | "mr") => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quickViewProduct: EnrichedProduct | null;
  setQuickViewProduct: (p: EnrichedProduct | null) => void;
  refreshCart: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addToCart: (
    productId: string,
    selectedSize?: string,
    quantity?: number,
    openDrawer?: boolean
  ) => Promise<boolean>;
  updateCartItem: (
    itemId: string,
    payload: { quantity?: number; selectedSize?: string }
  ) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  applyCoupon: (couponCode: string | null) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<{ ok: boolean; message?: string }>;
  toast: string | null;
  showToast: (msg: string) => void;
}

const EMPTY_CART: CartState = {
  items: [],
  itemCount: 0,
  subtotalBeforeGst: 0,
  gstTotal: 0,
  itemsGrossTotal: 0,
  discountAmount: 0,
  shippingCharges: 0,
  finalTotal: 0,
  appliedCoupon: null,
  couponError: null,
  freeShippingThreshold: 25000,
  freeShippingEnabled: true,
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY_CART);
  const [user, setUser] = useState<UserSessionUI | null>(null);
  const [lang, setLang] = useState<"en" | "mr">("en");
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] =
    useState<EnrichedProduct | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as CartState;
        setCart(data);
      }
    } catch {
      // ignore network error
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { user: UserSessionUI | null };
        setUser(data.user);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshCart();
    refreshUser();
  }, [refreshCart, refreshUser]);

  const addToCart = useCallback(
    async (
      productId: string,
      selectedSize?: string,
      quantity = 1,
      openDrawer = true
    ) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, selectedSize, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Could not add to cart");
        return false;
      }
      setCart(data as CartState);
      if (openDrawer) setCartOpen(true);
      showToast("Added to your jewellery bag");
      return true;
    },
    [showToast]
  );

  const updateCartItem = useCallback(
    async (
      itemId: string,
      payload: { quantity?: number; selectedSize?: string }
    ) => {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, ...payload }),
      });
      if (res.ok) {
        setCart((await res.json()) as CartState);
      }
    },
    []
  );

  const removeCartItem = useCallback(async (itemId: string) => {
    const res = await fetch(`/api/cart?itemId=${encodeURIComponent(itemId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCart((await res.json()) as CartState);
    }
  }, []);

  const applyCoupon = useCallback(async (couponCode: string | null) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "apply_coupon", couponCode }),
    });
    if (res.ok) {
      setCart((await res.json()) as CartState);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Please sign in to save to wishlist");
        return { ok: false, message: data.error };
      }
      await refreshUser();
      showToast(data.saved ? "Saved to Wishlist" : "Removed from Wishlist");
      return { ok: true };
    },
    [refreshUser, showToast]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        user,
        lang,
        setLang,
        cartOpen,
        setCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        refreshCart,
        refreshUser,
        addToCart,
        updateCartItem,
        removeCartItem,
        applyCoupon,
        toggleWishlist,
        toast,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#221F1B] px-5 py-2.5 text-sm font-medium text-[#FAF7F2] shadow-xl">
          {toast}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return ctx;
}
