import { apiFetch, apiFetchPaginated } from "@/lib/api/server";
import type {
  Attribute,
  Brand,
  Category,
  Collection,
  Product,
  ProductFilters,
  Review,
  Seo,
} from "@/lib/types";

function buildQuery(filters: object): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters as Record<string, unknown>)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(`${key}[]`, String(v)));
    } else {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getProducts(filters: ProductFilters = {}) {
  return apiFetchPaginated<Product>(`/products${buildQuery(filters)}`, {
    revalidate: 60,
    tags: ["products"],
  });
}

/** ProductController::show() (like Category/Brand/Collection show()) pairs
 * the resource with its resolved SEO under a nested key, not flat. */
export function getProductBySlug(slug: string) {
  return apiFetch<{ product: Product; seo: Seo }>(`/products/${slug}`, {
    revalidate: 300,
    tags: ["products", `product:${slug}`],
  });
}

export type ProductFlag =
  | "is_featured"
  | "is_best_seller"
  | "is_new_arrival"
  | "is_trending"
  | "is_flash_sale";

/** The backend endpoint always returns its default 12 — it takes no limit
 * param — so callers should slice() client-side if they need fewer. */
export function getProductsByFlag(flag: ProductFlag) {
  return apiFetch<Product[]>(`/products/flag/${flag}`, {
    revalidate: 120,
    tags: ["products"],
  });
}

export interface RatingSummary {
  average: number | null;
  count: number;
  breakdown: Record<string, number>;
}

/** Reviews come from a paginated query on the backend, but nesting a
 * paginated ResourceCollection inside a hand-built array (as this endpoint
 * does, alongside `summary`) drops Laravel's links/meta wrapping entirely —
 * this is genuinely just a flat array, capped at the repository's default
 * page size (15). */
export function getProductReviews(productId: number) {
  return apiFetch<{ reviews: Review[]; summary: RatingSummary }>(`/products/${productId}/reviews`, {
    revalidate: 60,
    tags: [`reviews:${productId}`],
  });
}

export function getCategories() {
  return apiFetch<Category[]>("/categories", {
    revalidate: 300,
    tags: ["categories"],
  });
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<{ category: Category; seo: Seo }>(`/categories/${slug}`, {
    revalidate: 300,
    tags: ["categories", `category:${slug}`],
  });
}

export function getBrands() {
  return apiFetch<Brand[]>("/brands", { revalidate: 300, tags: ["brands"] });
}

export function getBrandBySlug(slug: string) {
  return apiFetch<{ brand: Brand; seo: Seo }>(`/brands/${slug}`, {
    revalidate: 300,
    tags: ["brands", `brand:${slug}`],
  });
}

export function getCollections() {
  return apiFetch<Collection[]>("/collections", {
    revalidate: 300,
    tags: ["collections"],
  });
}

export function getCollectionBySlug(slug: string) {
  return apiFetch<{ collection: Collection; seo: Seo }>(`/collections/${slug}`, {
    revalidate: 300,
    tags: ["collections", `collection:${slug}`],
  });
}

export function getAttributes() {
  return apiFetch<Attribute[]>("/attributes", {
    revalidate: 600,
    tags: ["attributes"],
  });
}
