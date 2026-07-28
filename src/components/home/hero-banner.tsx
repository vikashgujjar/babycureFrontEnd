"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { ButtonLink } from "@/components/ui/button-link";
import { ContentIcon } from "@/lib/utils/dynamic-icon";
import type { Banner, HomepageSectionItem } from "@/lib/types";

function isDarkColor(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

export function HeroBanner({
  banners,
  trustBadge,
}: {
  banners: Banner[];
  trustBadge?: HomepageSectionItem | null;
}) {
  if (banners.length === 0) return null;

  return (
    <section className="relative">
      <Carousel
        loop={banners.length > 1}
        autoplay={banners.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
        pagination={banners.length > 1 ? { clickable: true } : false}
        className="hero-swiper"
      >
        {banners.map((banner) => {
          const textIsDark = isDarkColor(banner.text_color ?? "#ffffff");
          return (
          <CarouselSlide key={banner.id}>
            <div
              className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[640px]"
              style={{ backgroundColor: banner.background_color ?? undefined }}
            >
              {(banner.desktop_image || banner.mobile_image) && (
                <>
                  <Image
                    src={banner.desktop_image ?? banner.mobile_image!}
                    alt={banner.title}
                    fill
                    priority
                    sizes="100vw"
                    className="hidden object-cover sm:block"
                  />
                  <Image
                    src={banner.mobile_image ?? banner.desktop_image!}
                    alt={banner.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover sm:hidden"
                  />
                  <div
                    className={
                      textIsDark
                        ? "absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent"
                        : "absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/25 to-transparent"
                    }
                  />
                </>
              )}

              <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex max-w-lg flex-col gap-4" style={{ color: banner.text_color ?? "#ffffff" }}>
                  {banner.subtitle && (
                    <span className="text-sm font-semibold uppercase tracking-[0.15em] opacity-90">
                      {banner.subtitle}
                    </span>
                  )}
                  <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{banner.title}</h1>
                  {banner.description && (
                    <p className="max-w-md text-base opacity-90 sm:text-lg">{banner.description}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    {banner.button_text && banner.button_link && (
                      <ButtonLink
                        href={banner.button_link}
                        target={banner.open_in_new_tab ? "_blank" : undefined}
                        size="lg"
                      >
                        {banner.button_text}
                        <ArrowRight className="size-4" />
                      </ButtonLink>
                    )}

                    {trustBadge && (
                      <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                        <ContentIcon name={trustBadge.icon} className="size-4" />
                        {trustBadge.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CarouselSlide>
          );
        })}
      </Carousel>
    </section>
  );
}
