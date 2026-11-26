"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Home, Search, ShoppingBag } from "lucide-react";
import { useStore } from "./StoreProvider";

export function MobileBottomNav({
  onSearchClick,
}: {
  onSearchClick?: () => void;
}) {
  const pathname = usePathname();
  const { cart, user, setCartOpen } = useStore();

  const isHome = pathname === "/";
  const isCatalog = pathname.startsWith("/jewellery");
  const isWishlist = pathname === "/wishlist";

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-[#EFE8DC] bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHome ? "text-[#9A6F26]" : "text-[#6A6258] hover:text-[#221F1B]"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </Link>

        {/* Explore / Catalogue */}
        <Link
          href="/jewellery"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isCatalog ? "text-[#9A6F26]" : "text-[#6A6258] hover:text-[#221F1B]"
          }`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-0.5">Explore</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center py-1 text-[#6A6258] hover:text-[#221F1B]"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-0.5">Search</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            isWishlist ? "text-[#9A6F26]" : "text-[#6A6258] hover:text-[#221F1B]"
          }`}
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {user && user.wishlistProductIds.length > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9A6F26] text-[9px] font-bold text-white">
                {user.wishlistProductIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
        </Link>

        {/* Bag */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-[#6A6258] hover:text-[#221F1B]"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cart.itemCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9A6F26] text-[9px] font-bold text-white">
                {cart.itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5">Bag</span>
        </button>
      </div>
    </nav>
  );
}
