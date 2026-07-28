import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import type { Banner } from "@/lib/types";

export function BrandStory({ banner }: { banner: Banner | null }) {
  if (!banner) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
          {banner.desktop_image && (
            <Image
              src={banner.desktop_image}
              alt={banner.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {banner.subtitle && (
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">{banner.subtitle}</span>
          )}
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{banner.title}</h2>
          {banner.description && <p className="text-base leading-relaxed text-ink-soft">{banner.description}</p>}
          {banner.button_text && banner.button_link && (
            <ButtonLink href={banner.button_link} variant="primary" className="mt-2 w-fit">
              {banner.button_text}
              <ArrowRight className="size-4" />
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}
