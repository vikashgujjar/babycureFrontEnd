import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { ButtonLink } from "@/components/ui/button-link";
import type { Product } from "@/lib/types";

export function FeaturedProducts({
  title,
  subtitle,
  description,
  products,
}: {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={title} subtitle={subtitle} description={description} />
        <ProductGrid products={products} />
        <div className="flex justify-center">
          <ButtonLink href="/shop" variant="outline">
            View All Products
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
