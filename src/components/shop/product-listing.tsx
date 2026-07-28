import { getAttributes, getBrands, getCategories, getCollections, getProducts } from "@/lib/api/queries/catalog";
import { Container } from "@/components/ui/container";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import { ProductGrid } from "@/components/product/product-grid";
import type { ProductFilters } from "@/lib/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseProductFilters(sp: RawSearchParams): ProductFilters {
  const single = (key: string) => (Array.isArray(sp[key]) ? sp[key]?.[0] : sp[key]);
  const list = (key: string) => (Array.isArray(sp[key]) ? sp[key] : sp[key] ? [sp[key] as string] : []);

  return {
    term: single("term") || undefined,
    brand_id: single("brand_id") ? Number(single("brand_id")) : undefined,
    collection_id: single("collection_id") ? Number(single("collection_id")) : undefined,
    min_price: single("min_price") ? Number(single("min_price")) : undefined,
    max_price: single("max_price") ? Number(single("max_price")) : undefined,
    attribute_value_ids: list("attribute_value_ids").map(Number),
    in_stock: single("in_stock") === "1" ? true : undefined,
    sort_by: (single("sort_by") as ProductFilters["sort_by"]) || "created_at",
    sort_dir: (single("sort_dir") as ProductFilters["sort_dir"]) || "desc",
    page: single("page") ? Number(single("page")) : 1,
  };
}

interface ProductListingProps {
  title: string;
  description?: string | null;
  filters: ProductFilters;
  showCategoryFilter?: boolean;
  emptyMessage?: string;
}

/**
 * Shared body for both /shop and /category/[slug] — same filters, sort,
 * grid, and pagination, the only difference being whether `filters` already
 * pins a category_id and whether the category selector itself is shown.
 */
export async function ProductListing({
  title,
  description,
  filters,
  showCategoryFilter = true,
  emptyMessage,
}: ProductListingProps) {
  const [products, categories, brands, collections, attributes] = await Promise.all([
    getProducts(filters),
    getCategories().catch(() => []),
    getBrands().catch(() => []),
    getCollections().catch(() => []),
    getAttributes().catch(() => []),
  ]);

  return (
    <div className="py-10">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>
          {description && <p className="max-w-2xl text-sm text-ink-soft">{description}</p>}
          <p className="text-sm text-ink-soft">{products.meta.total} products</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <ShopFilters
            categories={categories}
            brands={brands}
            collections={collections}
            attributes={attributes}
            resultCount={products.meta.total}
            showCategoryFilter={showCategoryFilter}
          />

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-end">
              <SortSelect />
            </div>

            <ProductGrid
              products={products.data}
              emptyMessage={emptyMessage ?? "Try adjusting your filters or clearing them to see more products."}
            />
            <Pagination meta={products.meta} />
          </div>
        </div>
      </Container>
    </div>
  );
}
