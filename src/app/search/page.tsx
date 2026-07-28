import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { ProductListing, parseProductFilters, type RawSearchParams } from "@/components/shop/product-listing";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

interface SearchPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;

  return { title: q ? `Search results for "${q}"` : "Search" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim();

  if (!q) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={SearchIcon}
          title="Search Babycure"
          description="Use the search icon in the header to find products by name or SKU."
        />
      </Container>
    );
  }

  const filters = parseProductFilters(sp);
  filters.term = q;

  return (
    <ProductListing
      title={`Search results for "${q}"`}
      filters={filters}
      emptyMessage={`No products matched "${q}". Try a different search term.`}
    />
  );
}
