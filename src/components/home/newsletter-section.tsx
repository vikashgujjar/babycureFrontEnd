import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function NewsletterSection({
  title,
  subtitle,
  description,
}: {
  title: string | null;
  subtitle: string | null;
  description: string | null;
}) {
  if (!title) return null;

  return (
    <section className="bg-primary-dark py-16 text-white sm:py-20">
      <Container className="flex flex-col items-center gap-4 text-center">
        {subtitle && (
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">{subtitle}</span>
        )}
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
        {description && <p className="max-w-md text-sm text-white/80">{description}</p>}
        <div className="mt-2 w-full max-w-sm">
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
