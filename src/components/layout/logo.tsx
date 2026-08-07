import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  siteName: string;
  logoUrl?: string | null;
  className?: string;
  /** Text-fallback color needs to flip on a dark footer — the image itself
   * doesn't care, only the "no logo uploaded yet" fallback text does. */
  variant?: "light" | "dark";
  /** Inline style for the logo image only, e.g. brightening a dark-colored
   * logo so it reads on a dark footer background. */
  imgStyle?: CSSProperties;
}

export function Logo({ siteName, logoUrl, className, variant = "light", imgStyle }: LogoProps) {
  return (
    <Link href="/" className={className} aria-label={siteName}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={siteName}
          width={140}
          height={40}
          className="h-19 w-auto object-contain"
          style={imgStyle}
          priority
        />
      ) : (
        <span
          className={cn(
            "font-display text-2xl tracking-tight",
            variant === "dark" ? "text-white" : "text-ink",
          )}
        >
          {siteName}
        </span>
      )}
    </Link>
  );
}
