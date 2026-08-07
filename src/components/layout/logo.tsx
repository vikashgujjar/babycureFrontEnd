import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  siteName: string;
  logoUrl?: string | null;
  className?: string;
  /** Text-fallback color needs to flip on a dark footer — the image itself
   * doesn't care, only the "no logo uploaded yet" fallback text does. */
  variant?: "light" | "dark";
}

export function Logo({ siteName, logoUrl, className, variant = "light" }: LogoProps) {
  return (
    <Link href="/" className={className} aria-label={siteName}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={siteName}
          width={140}
          height={40}
          className={cn("h-19 w-auto object-contain", variant === "dark" && "brightness-0 invert")}
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
