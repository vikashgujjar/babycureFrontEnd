import type { Metadata } from "next";
import { getHomepage, getPublicSettings, getSeoHome, getTestimonials } from "@/lib/api/queries/content";
import { toMetadata } from "@/lib/utils/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { TrustIcons } from "@/components/home/trust-icons";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { SocialFeed } from "@/components/home/social-feed";
import { BrandStory } from "@/components/home/brand-story";
import { NewsletterSection } from "@/components/home/newsletter-section";
import type { Banner, Collection, HomepageSection, HomepageSectionItem, Product } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoHome().catch(() => null);
  return toMetadata(seo, "Babycure");
}

function findSection(sections: HomepageSection[], type: HomepageSection["type"]) {
  return sections.find((section) => section.type === type);
}

export default async function HomePage() {
  const [sections, seo, testimonials, settings] = await Promise.all([
    getHomepage().catch(() => [] as HomepageSection[]),
    getSeoHome().catch(() => null),
    getTestimonials({ featured: true }).catch(() => []),
    getPublicSettings().catch(() => null),
  ]);

  const hero = findSection(sections, "hero_banner");
  const featured = findSection(sections, "featured_products");
  const collections = findSection(sections, "collections");
  const trustBadges = findSection(sections, "trust_badges");
  const testimonialsSection = findSection(sections, "testimonials");
  const whyChooseUs = findSection(sections, "why_choose_us");
  const instagramFeed = findSection(sections, "instagram_feed");
  const brandStory = findSection(sections, "promotional_banner");
  const newsletter = findSection(sections, "newsletter");

  const trustBadgeItems = (trustBadges?.items as HomepageSectionItem[] | undefined) ?? [];

  return (
    <>
      <JsonLd data={seo?.schema} />

      <HeroBanner
        banners={(hero?.items as Banner[] | undefined) ?? []}
        trustBadge={trustBadgeItems[0] ?? null}
      />

      {featured && (
        <FeaturedProducts
          title={featured.title}
          subtitle={featured.subtitle}
          description={featured.description}
          products={(featured.items as Product[] | undefined) ?? []}
        />
      )}

      {collections && (
        <FeaturedCollections
          title={collections.title}
          subtitle={collections.subtitle}
          collections={(collections.items as Collection[] | undefined) ?? []}
        />
      )}

      {trustBadges && <TrustIcons title={trustBadges.title} items={trustBadgeItems} />}

      {testimonialsSection && (
        <Testimonials
          title={testimonialsSection.title}
          subtitle={testimonialsSection.subtitle}
          description={testimonialsSection.description}
          siteName={settings?.site_name ?? "Babycure"}
          logoUrl={settings?.site_logo ?? null}
          testimonials={testimonials}
        />
      )}

      {whyChooseUs && (
        <WhyChooseUs
          title={whyChooseUs.title}
          backgroundColor={whyChooseUs.background_color}
          items={(whyChooseUs.items as HomepageSectionItem[] | undefined) ?? []}
        />
      )}

      {instagramFeed && (
        <SocialFeed
          title={instagramFeed.title}
          subtitle={instagramFeed.subtitle}
          items={(instagramFeed.items as HomepageSectionItem[] | undefined) ?? []}
        />
      )}

      <BrandStory banner={(brandStory?.items as Banner[] | undefined)?.[0] ?? null} />

      {newsletter && (
        <NewsletterSection
          title={newsletter.title}
          subtitle={newsletter.subtitle}
          description={newsletter.description}
        />
      )}
    </>
  );
}
