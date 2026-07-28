"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { BuyNowButton } from "@/components/product/buy-now-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { VariantSelector } from "@/components/product/variant-selector";
import { useCartLine } from "@/lib/providers/cart-provider";
import { formatPrice, discountPercent } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState(hasVariants ? product.variants[0].id : null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = hasVariants
    ? (product.variants.find((v) => v.id === variantId) ?? product.variants[0])
    : null;
  const cartLine = useCartLine(product.id, selectedVariant?.id);

  const price = selectedVariant?.price ?? product.price;
  const discountPrice = selectedVariant?.discount_price ?? product.discount_price;
  const effectivePrice = selectedVariant?.effective_price ?? product.effective_price;
  const discount = discountPercent(price, discountPrice);

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
          {product.featured_image && (
            <Image
              src={product.featured_image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 90vw, 320px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {product.category && <p className="text-xs uppercase tracking-wide text-ink-soft">{product.category.name}</p>}
          <h3 className="font-display text-2xl text-ink">{product.name}</h3>

          {product.review_count > 0 && (
            <Rating value={product.rating_average ?? 0} count={product.review_count} />
          )}

          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-ink">{formatPrice(effectivePrice)}</span>
            {discountPrice && (
              <span className="text-sm text-ink-soft line-through">{formatPrice(price)}</span>
            )}
            {discount && <Badge variant="accent">{discount}% off</Badge>}
          </div>

          {product.short_description && (
            <p className="text-sm leading-relaxed text-ink-soft">{product.short_description}</p>
          )}

          {hasVariants && (
            <VariantSelector
              variants={product.variants}
              selectedId={variantId}
              onChange={(variant) => setVariantId(variant.id)}
            />
          )}

          <div className="mt-1 flex items-center gap-3">
            {!cartLine && <QuantityStepper value={quantity} onChange={setQuantity} />}
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              quantity={quantity}
              className={cartLine ? "text-nowrap" : "flex-1 text-nowrap"}
            />
            <BuyNowButton product={product} variant={selectedVariant} quantity={quantity} className="flex-1 text-nowrap" />
            <WishlistButton productId={product.id} className="static bg-sand" />
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
