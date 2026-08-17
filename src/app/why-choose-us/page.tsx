import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCmsPageBySlug } from "@/lib/api/queries/content";
import { toMetadata } from "@/lib/utils/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { CmsPageHero } from "@/components/cms/cms-page-hero";
import { CmsContentReveal } from "@/components/cms/cms-content-reveal";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getCmsPageBySlug("why-choose-us").catch(() => null);
  return toMetadata(result?.seo, "Why Choose Baby Cure");
}

export default async function WhyChooseUsPage() {
  const result = await getCmsPageBySlug("why-choose-us").catch(() => null);

  if (!result) notFound();

  const { page, seo } = result;

  return (
    <>
      <JsonLd data={seo.schema} />
      <article>
        <CmsPageHero kicker="Why Choose Us" title={page.title} tagline={page.excerpt} />

        {page.featured_image && (
          <div className="relative mx-auto mt-10 aspect-[21/9] w-full max-w-5xl overflow-hidden rounded-3xl px-4 sm:px-6 lg:px-8">
            <Image
              src={page.featured_image}
              alt={page.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="rounded-3xl object-cover"
            />
          </div>
        )}

        <Container className="max-w-3xl py-14">{page.content && <CmsContentReveal html={page.content} />}</Container>
      </article>
    </>
  );
}
