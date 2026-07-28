"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/api/mutations/wishlist";

export function WishlistLink() {
  const { data } = useWishlist();
  const count = data?.length ?? 0;

  return (
    <Link
      href="/account/wishlist"
      className="relative flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand"
      aria-label={`Wishlist, ${count} item${count === 1 ? "" : "s"}`}
    >
      <Heart className="size-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
