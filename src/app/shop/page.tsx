import type { Metadata } from "next";
import { ProductListing, parseProductFilters, type RawSearchParams } from "@/components/shop/product-listing";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full range of dermatologically tested baby care essentials.",
};

interface ShopPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const filters = parseProductFilters(sp);

  if (sp.category_id) {
    filters.category_id = Number(Array.isArray(sp.category_id) ? sp.category_id[0] : sp.category_id);
  }

  return <ProductListing title="Shop All Products" filters={filters} />;
}
