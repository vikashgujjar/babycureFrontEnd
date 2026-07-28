"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string | null;
  alt: string;
}

export function ProductGallery({ images, videoUrl, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl bg-sand"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setZoomOrigin(`${x}% ${y}%`);
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {showVideo && videoUrl ? (
          <video src={videoUrl} controls autoPlay className="size-full object-cover" />
        ) : (
          activeImage && (
            <Image
              src={activeImage}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={{
                transformOrigin: zoomOrigin,
                transform: zoomed ? "scale(1.6)" : "scale(1)",
              }}
            />
          )
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image + index}
            onClick={() => {
              setActiveIndex(index);
              setShowVideo(false);
            }}
            className={cn(
              "relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 bg-sand transition-colors",
              !showVideo && activeIndex === index ? "border-primary" : "border-transparent",
            )}
          >
            <Image src={image} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}

        {videoUrl && (
          <button
            onClick={() => setShowVideo(true)}
            className={cn(
              "relative flex size-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-ink transition-colors",
              showVideo ? "border-primary" : "border-transparent",
            )}
          >
            <Play className="size-5 fill-white text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
