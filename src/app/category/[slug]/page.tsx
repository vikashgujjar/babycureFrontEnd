import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/queries/catalog";
import { ProductListing, parseProductFilters, type RawSearchParams } from "@/components/shop/product-listing";
import { toMetadata } from "@/lib/utils/seo";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug).catch(() => null);

  if (!result) return { title: "Category" };

  return toMetadata(result.seo, result.category.name);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const [result, sp] = await Promise.all([getCategoryBySlug(slug).catch(() => null), searchParams]);

  if (!result) notFound();
  const { category } = result;

  const filters = parseProductFilters(sp);
  filters.category_id = category.id;

  return (
    <ProductListing
      title={category.name}
      description={category.description}
      filters={filters}
      showCategoryFilter={false}
      emptyMessage={`No products found in ${category.name} yet — check back soon.`}
    />
  );
}
