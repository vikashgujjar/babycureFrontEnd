import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCmsPageBySlug } from "@/lib/api/queries/content";
import { toMetadata } from "@/lib/utils/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CmsPageView } from "@/components/cms/cms-page-view";

/**
 * Every static CMS route (About Us, Privacy Policy, Terms, Shipping,
 * Refund...) is the same shell around a different slug — this factory keeps
 * that logic in one place instead of copy-pasting a generateMetadata +
 * page component per route.
 */
export function createCmsPage(slug: string, fallbackTitle: string) {
  async function generateMetadata(): Promise<Metadata> {
    const result = await getCmsPageBySlug(slug).catch(() => null);
    return toMetadata(result?.seo, fallbackTitle);
  }

  async function CmsRoutePage() {
    const result = await getCmsPageBySlug(slug).catch(() => null);

    if (!result) notFound();

    return (
      <>
        <JsonLd data={result.seo.schema} />
        <CmsPageView page={result.page} />
      </>
    );
  }

  return { generateMetadata, CmsRoutePage };
}
