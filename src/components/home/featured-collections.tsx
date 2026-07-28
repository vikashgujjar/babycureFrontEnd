import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import type { Collection } from "@/lib/types";

export function FeaturedCollections({
  title,
  subtitle,
  collections,
}: {
  title: string | null;
  subtitle: string | null;
  collections: Collection[];
}) {
  if (collections.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="grid gap-6 sm:grid-cols-2">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl bg-sand"
            >
              {collection.image && (
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

              <div className="relative z-10 flex flex-col gap-2 p-8 text-white">
                <h3 className="font-display text-2xl">{collection.name}</h3>
                {collection.description && (
                  <p className="max-w-sm text-sm text-white/85">{collection.description}</p>
                )}
                <ButtonLink
                  href={`/shop?collection_id=${collection.id}`}
                  variant="secondary"
                  size="sm"
                  className="mt-2 w-fit bg-white text-ink hover:bg-white/90"
                >
                  Shop Collection <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
