"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import type { HomepageSectionItem } from "@/lib/types";

export function SocialFeed({
  title,
  subtitle,
  items,
}: {
  title: string | null;
  subtitle: string | null;
  items: HomepageSectionItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={title} subtitle={subtitle} />

        <Carousel
          slidesPerView={2.2}
          spaceBetween={16}
          breakpoints={{ 640: { slidesPerView: 3.2 }, 1024: { slidesPerView: 5 } }}
        >
          {items.map((item) => (
            <CarouselSlide key={item.id}>
              <a
                href={item.link ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-sand"
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title ?? ""}
                    fill
                    sizes="(max-width: 640px) 45vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/30">
                  <Play className="size-8 fill-white text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
