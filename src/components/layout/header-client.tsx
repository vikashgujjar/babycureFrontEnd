"use client";

import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchBar } from "@/components/layout/search-bar";
import { AccountMenu } from "@/components/layout/account-menu";
import { WishlistLink } from "@/components/layout/wishlist-link";
import { CartLink } from "@/components/layout/cart-link";
import type { Menu, PublicSettings } from "@/lib/types";

export function HeaderClient({
  menu,
  settings,
}: {
  menu: Menu | null;
  settings: PublicSettings | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = menu?.items ?? [];
  const siteName = settings?.site_name ?? "Babycure";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-21 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-5" strokeWidth={1.5} />
          </button>
          <Logo siteName={siteName} logoUrl={settings?.site_logo} />
        </div>

        <MegaMenu items={items} />

        <div className="flex items-center gap-0.5">
          <SearchBar />
          <AccountMenu />
          <WishlistLink />
          <CartLink />
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={items} />
    </header>
  );
}
