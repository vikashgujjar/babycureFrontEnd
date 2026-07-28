"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { WishlistButton } from "@/components/product/wishlist-button";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import { formatPrice, discountPercent } from "@/lib/utils/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const hoverImage = product.gallery.find((url) => url !== product.featured_image) ?? null;
  const discount = discountPercent(product.price, product.discount_price);

  return (
    <>
      <div className="group relative flex flex-col">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand">
            {product.featured_image && (
              <>
                <Image
                  src={product.featured_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-opacity duration-300 ${hoverImage ? "group-hover:opacity-0" : ""}`}
                />
                {hoverImage && (
                  <Image
                    src={hoverImage}
                    alt=""
                    fill
                    aria-hidden
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </>
            )}

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {discount && <Badge variant="accent">{discount}% off</Badge>}
              {product.flags.is_new_arrival && <Badge variant="default">New</Badge>}
              {!product.in_stock && <Badge variant="outline">Out of Stock</Badge>}
            </div>

            <WishlistButton productId={product.id} className="absolute right-3 top-3" />

            <button
              onClick={(event) => {
                event.preventDefault();
                setQuickViewOpen(true);
              }}
              className="absolute bottom-3 text-nowrap left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-ink opacity-0 shadow-soft transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Eye className="size-3.5" /> Quick View
            </button>
          </div>
        </Link>

        <div className="mt-3 flex flex-col gap-1">
          {product.review_count > 0 && (
            <Rating value={product.rating_average ?? 0} count={product.review_count} />
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-1 text-sm font-medium text-ink transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{formatPrice(product.effective_price)}</span>
            {product.discount_price && (
              <span className="text-xs text-ink-soft line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <AddToCartButton product={product} size="sm" className="mt-2 w-full" />
        </div>
      </div>

      <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
