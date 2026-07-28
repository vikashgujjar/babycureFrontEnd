"use client";

import { ShoppingBag } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCartContext, useCartLine } from "@/lib/providers/cart-provider";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import type { Product, ProductVariant } from "@/lib/types";

// QuantityStepper has a single fixed height (h-11); match it to whichever
// button size it's replacing so swapping between the two states in the same
// slot doesn't visibly change the control's height.
const STEPPER_HEIGHT_BY_SIZE: Record<ButtonSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12",
  icon: "h-11",
};

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant | null;
  quantity?: number;
  variantStyle?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  label?: string;
}

export function AddToCartButton({
  product,
  variant = null,
  quantity = 1,
  variantStyle = "primary",
  size = "md",
  className,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const { addItem, updateItem, removeItem } = useCartContext();
  const cartLine = useCartLine(product.id, variant?.id);
  const { toast } = useToast();

  const outOfStock = variant ? variant.stock_quantity <= 0 : !product.in_stock;

  // Already in the cart — swap the button for an inline quantity control
  // instead of offering "Add to Cart" again.
  if (cartLine) {
    return (
      <QuantityStepper
        value={cartLine.quantity}
        min={0}
        onChange={(next) => {
          if (next <= 0) {
            removeItem(cartLine.key);
          } else {
            updateItem(cartLine.key, next);
          }
        }}
        className={cn(STEPPER_HEIGHT_BY_SIZE[size], className)}
      />
    );
  }

  return (
    <Button
      variant={variantStyle}
      size={size}
      className={className}
      disabled={outOfStock}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(product, variant, quantity);
        toast({ title: "Added to cart", description: product.name, variant: "success" });
      }}
    >
      <ShoppingBag className="size-4" />
      {outOfStock ? "Out of Stock" : label}
    </Button>
  );
}
