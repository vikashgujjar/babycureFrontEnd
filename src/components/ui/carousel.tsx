"use client";

import { Swiper, type SwiperProps } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils/cn";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export { SwiperSlide as CarouselSlide } from "swiper/react";

export function Carousel({ children, modules = [], className, ...props }: SwiperProps) {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, ...modules]}
      resizeObserver={false}
      className={cn("w-full max-w-full", className)}
      {...props}
    >
      {children}
    </Swiper>
  );
}
