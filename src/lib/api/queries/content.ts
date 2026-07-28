import { apiFetch } from "@/lib/api/server";
import type {
  Banner,
  CmsPage,
  Faq,
  HomepageSection,
  Menu,
  PublicSettings,
  Seo,
  Testimonial,
} from "@/lib/types";

/** The fully-resolved homepage layout — every enabled section, in order,
 * with its own data already attached server-side. One call powers the
 * entire dynamic homepage. */
export function getHomepage() {
  return apiFetch<HomepageSection[]>("/homepage", {
    revalidate: 60,
    tags: ["homepage"],
  });
}

export function getBannersByPosition(position: string) {
  return apiFetch<Banner[]>(`/banners/${position}`, {
    revalidate: 120,
    tags: ["banners", `banners:${position}`],
  });
}

export function getMenu(location: "header" | "footer" | "mobile" | "sidebar") {
  return apiFetch<Menu>(`/menus/${location}`, {
    revalidate: 300,
    tags: ["menus", `menu:${location}`],
  });
}

export function getTestimonials(options: { featured?: boolean; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.featured) params.set("featured", "1");
  if (options.limit) params.set("limit", String(options.limit));
  const query = params.toString();

  return apiFetch<Testimonial[]>(`/testimonials${query ? `?${query}` : ""}`, {
    revalidate: 300,
    tags: ["testimonials"],
  });
}

export function getFaqs(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";

  return apiFetch<Faq[]>(`/faqs${query}`, {
    revalidate: 300,
    tags: ["faqs"],
  });
}

export function getFaqCategories() {
  return apiFetch<string[]>("/faqs/categories", {
    revalidate: 300,
    tags: ["faqs"],
  });
}

export function getCmsPages() {
  return apiFetch<CmsPage[]>("/cms-pages", {
    revalidate: 300,
    tags: ["cms-pages"],
  });
}

export function getCmsPageBySlug(slug: string) {
  return apiFetch<{ page: CmsPage; seo: Seo }>(`/cms-pages/${slug}`, {
    revalidate: 300,
    tags: ["cms-pages", `cms-page:${slug}`],
  });
}

export function getSeoHome() {
  return apiFetch<Seo>("/seo/home", {
    revalidate: 300,
    tags: ["seo", "seo:home"],
  });
}

export function getPublicSettings() {
  return apiFetch<PublicSettings>("/settings/public", {
    revalidate: 300,
    tags: ["settings"],
  });
}

export interface SitemapEntry {
  loc: string;
  lastmod: string | null;
  changefreq: string;
  priority: string;
}

/** Relative paths only — the backend deliberately has no opinion on the
 * storefront's own public domain, so Next's sitemap.ts prefixes SITE_URL. */
export function getSitemapEntries() {
  return apiFetch<SitemapEntry[]>("/seo/sitemap", {
    revalidate: 3600,
    tags: ["sitemap"],
  });
}
