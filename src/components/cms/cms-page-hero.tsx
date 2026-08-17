import { Container } from "@/components/ui/container";

/** Shared decorative hero for rich editorial CMS pages (About Us, Why
 * Choose Us, ...) — soft blurred brand-color blobs behind a staggered
 * fade-up title/kicker/tagline. */
export function CmsPageHero({ kicker, title, tagline }: { kicker: string; title: string; tagline?: string | null }) {
  return (
    <div className="relative isolate overflow-hidden border-b border-line bg-sand py-20 sm:py-28">
      <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-72 rounded-full bg-primary/15 blur-3xl sm:size-96" />
      <div aria-hidden className="absolute -right-20 top-10 -z-10 size-64 rounded-full bg-accent/15 blur-3xl sm:size-80" />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        <span className="animate-hero-in rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-dark shadow-sm">
          {kicker}
        </span>
        <h1 className="animate-hero-in font-display text-4xl text-ink sm:text-6xl [animation-delay:0.1s]">{title}</h1>
        {tagline && (
          <p className="animate-hero-in max-w-2xl font-display text-xl text-primary-dark sm:text-3xl [animation-delay:0.2s]">
            {tagline}
          </p>
        )}
      </Container>
    </div>
  );
}
