import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { CmsPage } from "@/lib/types";

export function CmsPageView({ page }: { page: CmsPage }) {
  return (
    <article>
      <div className="border-b border-line bg-sand py-14 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display text-3xl text-ink sm:text-4xl">{page.title}</h1>
          {page.excerpt && <p className="max-w-xl text-ink-soft">{page.excerpt}</p>}
        </Container>
      </div>

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

      <Container className="max-w-3xl py-14">
        {page.content && (
          <div className="cms-content" dangerouslySetInnerHTML={{ __html: page.content }} />
        )}
      </Container>
    </article>
  );
}
