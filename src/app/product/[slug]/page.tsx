import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProductReviews, getProducts } from "@/lib/api/queries/catalog";
import { toMetadata } from "@/lib/utils/seo";
import { buildProductSchema } from "@/lib/utils/product-schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductReviews } from "@/components/product/product-reviews";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductGrid } from "@/components/product/product-grid";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug).catch(() => null);

  if (!result) return { title: "Product" };

  return toMetadata(result.seo, result.product.name);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug).catch(() => null);

  if (!result) notFound();
  const { product } = result;

  const [{ reviews, summary }, related] = await Promise.all([
    getProductReviews(product.id).catch(() => ({ reviews: [], summary: { average: null, count: 0, breakdown: {} } })),
    product.category
      ? getProducts({ category_id: product.category.id, sort_by: "created_at", sort_dir: "desc" }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const relatedProducts = (related?.data ?? []).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-8 sm:py-10">
      <JsonLd data={buildProductSchema(product)} />

      <Container className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-ink">{product.name}</span>
      </Container>

      <Container>
        <ProductDetail product={product} reviewSummary={summary} />
      </Container>

      <Container className="border-t border-line py-14">
        {product.description && (
          <div className="cms-content max-w-3xl" dangerouslySetInnerHTML={{ __html: product.description }} />
        )}
      </Container>

      <Container id="reviews" className="border-t border-line py-14">
        <h2 className="mb-8 font-display text-2xl text-ink">Customer Reviews</h2>
        <ProductReviews productId={product.id} reviews={reviews} summary={summary} />
      </Container>

      {relatedProducts.length > 0 && (
        <Container className="border-t border-line py-14">
          <h2 className="mb-8 font-display text-2xl text-ink">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </Container>
      )}

      <RecentlyViewed product={product} />
    </div>
  );
}
