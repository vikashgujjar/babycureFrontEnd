import { SITE_URL } from "@/lib/constants";
import type { Product } from "@/lib/types";

/** Builds the schema.org Product graph for the PDP's JSON-LD block —
 * generated from the same product payload the page renders, so it can
 * never drift from what's actually on the page. */
export function buildProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.featured_image, ...product.gallery].filter(Boolean),
    description: product.short_description ?? undefined,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.effective_price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating_average,
            reviewCount: product.review_count,
          }
        : undefined,
  };
}
