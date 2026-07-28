import type { Metadata } from "next";
import type { Seo } from "@/lib/types";

/**
 * Every page's generateMetadata funnels its backend Seo payload through this
 * one mapping so Title/Description/Canonical/OG/Twitter stay consistent —
 * the backend is the source of truth, this just reshapes it for Next's
 * Metadata API.
 */
export function toMetadata(seo: Seo | null | undefined, fallbackTitle: string): Metadata {
  const title = seo?.meta_title ?? fallbackTitle;
  const description = seo?.meta_description ?? undefined;

  return {
    title,
    description,
    keywords: seo?.meta_keywords ?? undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots: seo?.robots ?? undefined,
    openGraph: {
      title: seo?.og_title ?? title,
      description: seo?.og_description ?? description,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitter_title ?? seo?.og_title ?? title,
      description: seo?.twitter_description ?? seo?.og_description ?? description,
      images: seo?.twitter_image ? [seo.twitter_image] : undefined,
    },
  };
}
