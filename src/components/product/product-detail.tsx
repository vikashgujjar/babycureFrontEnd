"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { BuyNowButton } from "@/components/product/buy-now-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { ShareButton } from "@/components/product/share-button";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCartLine } from "@/lib/providers/cart-provider";
import { formatPrice, discountPercent } from "@/lib/utils/format";
import type { RatingSummary } from "@/lib/api/queries/catalog";
import type { Product } from "@/lib/types";

export function ProductDetail({
  product,
  reviewSummary,
}: {
  product: Product;
  reviewSummary: RatingSummary;
}) {
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState(hasVariants ? product.variants[0].id : null);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = hasVariants
    ? (product.variants.find((v) => v.id === variantId) ?? product.variants[0])
    : null;

  const images = selectedVariant?.gallery.length
    ? [selectedVariant.primary_image, ...selectedVariant.gallery].filter((v): v is string => Boolean(v))
    : [product.featured_image, ...product.gallery].filter((v): v is string => Boolean(v));

  const price = selectedVariant?.price ?? product.price;
  const discountPrice = selectedVariant?.discount_price ?? product.discount_price;
  const effectivePrice = selectedVariant?.effective_price ?? product.effective_price;
  const discount = discountPercent(price, discountPrice);
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : product.in_stock;
  const cartLine = useCartLine(product.id, selectedVariant?.id);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 pb-3">
      <ProductGallery images={images} videoUrl={selectedVariant?.video_url} alt={product.name} />

      <div className="flex flex-col gap-4">
        {product.brand && <p className="text-xs uppercase tracking-wide text-ink-soft">{product.brand.name}</p>}
        <h1 className="font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>

        {product.review_count > 0 && (
          <a href="#reviews" className="w-fit">
            <Rating value={product.rating_average ?? 0} count={product.review_count} size="md" />
          </a>
        )}

        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-ink">{formatPrice(effectivePrice)}</span>
          {discountPrice && <span className="text-base text-ink-soft line-through">{formatPrice(price)}</span>}
          {discount && <Badge variant="accent">{discount}% off</Badge>}
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          {inStock ? (
            <span className="flex items-center gap-1.5 text-primary-dark">
              <CheckCircle2 className="size-4" /> In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-danger">
              <XCircle className="size-4" /> Out of Stock
            </span>
          )}
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

        <div className="mt-2 flex items-center gap-3">
          {/* Once it's in the cart, AddToCartButton itself becomes the
              quantity control — a separate "quantity to add" stepper next
              to it would be a confusing duplicate. */}
          {!cartLine && <QuantityStepper value={quantity} onChange={setQuantity} />}
          <AddToCartButton
            product={product}
            variant={selectedVariant}
            quantity={quantity}
            size="lg"
            className={cartLine ? undefined : "flex-1"}
          />
          <BuyNowButton product={product} variant={selectedVariant} quantity={quantity} size="lg" className="flex-1" />
          <WishlistButton productId={product.id} className="static shrink-0 bg-sand" />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <ShareButton title={product.name} />
          <span className="text-sm text-ink-soft">SKU: {selectedVariant?.sku ?? product.sku}</span>
        </div>

        {product.attribute_values && product.attribute_values.length > 0 && (
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-4 text-sm">
            {product.attribute_values.map((attr) => (
              <div key={attr.attribute_value_id} className="contents">
                <dt className="text-ink-soft">{attr.attribute_name}</dt>
                <dd className="text-ink">{attr.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Link href="#reviews" className="text-sm text-ink-soft hover:text-ink">
          {reviewSummary.count > 0 ? `See all ${reviewSummary.count} reviews` : "Be the first to review"}
        </Link>
      </div>
    </div>
  );
}
