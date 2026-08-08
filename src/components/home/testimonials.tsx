"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, MapPin, Quote, Star, Users } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { Container } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { Logo } from "@/components/layout/logo";
import type { Testimonial } from "@/lib/types";

function Divider() {
  return (
    <span className="flex items-center gap-1.5 text-primary">
      <span className="h-px w-5 bg-line" aria-hidden />
      <span className="size-1 rounded-full bg-current" aria-hidden />
    </span>
  );
}

const CARD_ACCENTS = [
  { ring: "ring-primary-light", name: "text-primary" },
  { ring: "ring-accent-light", name: "text-accent" },
] as const;

const DEFAULT_DESCRIPTION =
  "At Baby Cure, every formula is dermatologically tested and crafted with love for your little one's delicate skin. Here's what real parents have to say about their experience with us.";

/** Colors the last couple of words on their own line, matching the reference design's two-tone headings. */
function splitHeading(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return { lead: title, accent: null as string | null };
  return { lead: words.slice(0, -2).join(" "), accent: words.slice(-2).join(" ") };
}

export function Testimonials({
  title,
  subtitle,
  description,
  siteName,
  logoUrl,
  testimonials,
}: {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  siteName: string;
  logoUrl: string | null;
  testimonials: Testimonial[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (testimonials.length === 0) return null;

  const heading = title ? splitHeading(title) : null;
  const avgRating = testimonials.reduce((sum, t) => sum + (t.rating ?? 5), 0) / testimonials.length;

  return (
    <section className="overflow-hidden bg-linear-to-b from-primary-light/50 via-paper to-paper py-16 sm:py-20">
      <Container className="flex flex-col gap-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink shadow-soft">
              <Users className="size-4 text-primary" />
              {subtitle ?? "Parents Review"}
              <Heart className="size-3.5 fill-accent text-accent" />
            </span>

            {heading && (
              <h2 className="max-w-md font-display text-4xl leading-tight text-ink sm:text-5xl">
                {heading.lead}
                {heading.accent && (
                  <>
                    <br />
                    <span className="text-primary">{heading.accent}</span>{" "}
                    <Heart className="inline size-6 -translate-y-1 fill-accent text-accent sm:size-7" aria-hidden />
                  </>
                )}
              </h2>
            )}

            <Divider />

            <p className="max-w-sm text-sm text-ink-soft sm:text-base">{description ?? DEFAULT_DESCRIPTION}</p>

            <div className="flex items-center gap-2 text-sm">
              <Star className="size-4 fill-warning text-warning" />
              <span className="font-semibold text-ink">{avgRating.toFixed(1)} average rating</span>
              <span className="text-ink-soft">from parents who've tried us</span>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <div className="relative mx-auto aspect-4/5 w-full max-w-xs sm:mx-0">
              <div className="absolute inset-0 -rotate-3 rounded-[2.5rem] bg-accent-light/70" aria-hidden />
              <div
                className="absolute inset-0 rotate-2 rounded-[2.5rem] bg-linear-to-br from-primary-light to-accent-light"
                aria-hidden
              />
              <Image
                src="/babyMother.png"
                alt="Mother holding her baby"
                fill
                sizes="(min-width: 1024px) 20rem, 60vw"
                className="relative rounded-[2.5rem] object-cover shadow-lift"
              />

              <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-lift">
                <div className="flex -space-x-3">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-white bg-sand-dark"
                    >
                      {testimonial.photo && (
                        <Image
                          src={testimonial.photo}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-warning text-warning" />
                    <span className="text-sm font-bold text-ink">{avgRating.toFixed(1)}</span>
                  </div>
                  <p className="whitespace-nowrap text-[11px] text-ink-soft">Loved by parents</p>
                </div>
              </div>

              <Heart
                className="absolute -top-3 -left-3 size-8 rounded-full border border-line bg-white p-1.5 text-primary shadow-soft"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-soft transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-soft transition-colors hover:border-primary/40 hover:text-primary"
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
          pagination={false}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 3 } }}
          className="testimonial-swiper overflow-hidden min-h-64 pb-12"
        >
          {testimonials.map((testimonial, index) => {
            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
            return (
              <CarouselSlide key={testimonial.id} className="h-auto">
                <figure className="group relative flex h-full min-h-60 flex-col gap-4 overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lift">
                  <Quote
                    className="pointer-events-none absolute -top-3 -right-3 size-20 text-primary-light transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                    aria-hidden
                  />

                  <div className="relative flex items-center gap-3">
                    <div
                      className={`relative size-12 shrink-0 overflow-hidden rounded-full bg-sand-dark ring-2 ring-offset-2 ${accent.ring}`}
                    >
                      {testimonial.photo && (
                        <Image
                          src={testimonial.photo}
                          alt={testimonial.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-bold ${accent.name}`}>{testimonial.name}</p>
                      {testimonial.designation && (
                        <p className="flex items-center gap-1 text-xs text-ink-soft">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{testimonial.designation}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <Rating value={testimonial.rating ?? 5} className="relative" />

                  <blockquote className="relative line-clamp-4 flex-1 text-sm leading-relaxed text-ink-soft">
                    “{testimonial.content}”
                  </blockquote>
                </figure>
              </CarouselSlide>
            );
          })}
        </Carousel>
      </Container>
    </section>
  );
}
