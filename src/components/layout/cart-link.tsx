"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartContext } from "@/lib/providers/cart-provider";

export function CartLink() {
  const { itemCount } = useCartContext();

  return (
    <Link
      href="/cart"
      className="relative flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand"
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
