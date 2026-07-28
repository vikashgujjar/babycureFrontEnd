"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useCurrentCustomer } from "@/lib/api/mutations/auth";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/lib/api/mutations/wishlist";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

export function WishlistButton({ productId, className }: { productId: number; className?: string }) {
  const { data: customer } = useCurrentCustomer();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { toast } = useToast();
  const router = useRouter();

  const isSaved = wishlist?.some((entry) => entry.product.id === productId) ?? false;
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!customer) {
      toast({ title: "Sign in required", description: "Sign in to save items to your wishlist.", variant: "info" });
      router.push("/account/login");
      return;
    }

    if (isSaved) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId, {
        onSuccess: () => toast({ title: "Saved to wishlist", variant: "success" }),
      });
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-soft backdrop-blur transition-colors hover:text-accent disabled:opacity-60",
        isSaved && "text-accent",
        className,
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isSaved}
    >
      <Heart className={cn("size-4", isSaved && "fill-accent")} />
    </button>
  );
}
