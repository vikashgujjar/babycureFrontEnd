"use client";

import { Heart } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductGrid } from "@/components/product/product-grid";
import { useWishlist } from "@/lib/api/mutations/wishlist";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-ink">My Wishlist</h1>
        <p className="text-sm text-ink-soft">Products you&apos;ve saved for later.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : !wishlist || wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love by tapping the heart icon."
          action={<ButtonLink href="/shop">Browse Products</ButtonLink>}
        />
      ) : (
        <ProductGrid products={wishlist.map((entry) => entry.product)} />
      )}
    </div>
  );
}
