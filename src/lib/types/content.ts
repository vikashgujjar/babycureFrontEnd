export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  background_color: string | null;
  text_color: string | null;
  position: string;
  open_in_new_tab: boolean;
  status: "active" | "inactive";
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  desktop_image: string | null;
  mobile_image: string | null;
}

export interface HomepageSectionItem {
  id: number;
  icon: string | null;
  title: string | null;
  description: string | null;
  link: string | null;
  thumbnail: string | null;
  sort_order: number;
}

export type HomepageSectionType =
  | "hero_banner"
  | "featured_products"
  | "best_sellers"
  | "new_arrivals"
  | "trending_products"
  | "category_slider"
  | "collections"
  | "promotional_banner"
  | "why_choose_us"
  | "trust_badges"
  | "testimonials"
  | "instagram_feed"
  | "newsletter"
  | "footer_banner";

/** The 'items' shape varies by section type — narrow it at the call site. */
export interface HomepageSection {
  type: HomepageSectionType;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  background_color: string | null;
  section_style: string | null;
  items?: unknown;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  photo: string | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

/**
 * The `seo` field CmsPageController::show() returns alongside `page` is the
 * fully resolved SeoService::resolveFor() output (matching the shared `Seo`
 * type) — CmsPageResource's own nested seo, deliberately omitted here, is a
 * raw model dump (schema_json, *_image_id) with unresolved image URLs, so
 * the frontend always reads the sibling `seo`, never `page.seo`.
 */
export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  template: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  status: "active" | "inactive";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  label: string;
  url: string;
  icon: string | null;
  open_in_new_tab: boolean;
  children: MenuItem[];
}

export interface Menu {
  name: string;
  location: "header" | "footer" | "mobile" | "sidebar";
  items: MenuItem[];
}

export interface PublicSettings {
  site_name: string;
  site_email: string | null;
  site_phone: string | null;
  site_address: string | null;
  currency: string;
  timezone: string;
  language: string;
  whatsapp_number: string | null;
  site_logo: string | null;
  favicon: string | null;
  social: {
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
    linkedin_url?: string | null;
    pinterest_url?: string | null;
  };
  maintenance_mode: boolean;
  announcement_bar: {
    enabled: boolean;
    text: string | null;
    link: string | null;
    background_color: string | null;
    text_color: string | null;
  };
}
