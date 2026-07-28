"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { Rating } from "@/components/ui/rating";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import type { Testimonial } from "@/lib/types";

export function Testimonials({
  title,
  subtitle,
  testimonials,
}: {
  title: string | null;
  subtitle: string | null;
  testimonials: Testimonial[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-sand py-16 sm:py-20">
      <Container className="flex flex-col gap-6">
        <SectionHeading title={title} subtitle={subtitle} />

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        <Carousel
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          spaceBetween={24}
          rewind
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="testimonial-swiper overflow-hidden min-h-[19rem] pb-12"
        >
          {testimonials.map((testimonial) => (
            <CarouselSlide key={testimonial.id} className="h-auto">
              <figure className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-paper p-7 shadow-soft">
                <Rating value={testimonial.rating ?? 5} />
                <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
                  “{testimonial.content}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-sand-dark">
                    {testimonial.photo && (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{testimonial.name}</p>
                    {testimonial.designation && (
                      <p className="text-xs text-ink-soft">{testimonial.designation}</p>
                    )}
                  </div>
                </figcaption>
              </figure>
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
