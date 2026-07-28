"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button, type ButtonSize } from "@/components/ui/button";
import { useCartContext, useCartLine } from "@/lib/providers/cart-provider";
import type { Product, ProductVariant } from "@/lib/types";

interface BuyNowButtonProps {
  product: Product;
  variant?: ProductVariant | null;
  quantity?: number;
  size?: ButtonSize;
  className?: string;
}

export function BuyNowButton({ product, variant = null, quantity = 1, size = "lg", className }: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCartContext();
  const cartLine = useCartLine(product.id, variant?.id);
  const [isNavigating, setIsNavigating] = useState(false);

  const outOfStock = variant ? variant.stock_quantity <= 0 : !product.in_stock;

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      disabled={outOfStock}
      isLoading={isNavigating}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsNavigating(true);
        // Already in the cart — don't add a second time, just go straight
        // to checkout with what's there.
        if (!cartLine) {
          addItem(product, variant, quantity);
        }
        router.push("/checkout");
      }}
    >
      <Zap className="size-4" />
      Buy Now
    </Button>
  );
}
