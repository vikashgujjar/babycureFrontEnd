"use client";

import { useRecentlyViewed, useRecordRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import type { Product } from "@/lib/types";

/** Records the current product as viewed (client-only, so it never affects
 * the server-rendered page) and renders the visitor's recently-viewed rail
 * beneath it, excluding the product they're currently looking at. */
export function RecentlyViewed({ product }: { product: Product }) {
  useRecordRecentlyViewed(product);
  const recentlyViewed = useRecentlyViewed(product.id);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="border-t border-line py-14">
      <Container className="flex flex-col gap-6">
        <h2 className="font-display text-2xl text-ink">Recently Viewed</h2>
        <ProductGrid products={recentlyViewed} />
      </Container>
    </section>
  );
}
