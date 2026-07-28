import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ContentIcon } from "@/lib/utils/dynamic-icon";
import type { HomepageSectionItem } from "@/lib/types";

export function WhyChooseUs({
  title,
  backgroundColor,
  items,
}: {
  title: string | null;
  backgroundColor: string | null;
  items: HomepageSectionItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: backgroundColor ?? undefined }}>
      <Container className="flex flex-col gap-10">
        <SectionHeading title={title} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white">
                <ContentIcon name={item.icon} className="size-6" />
              </div>
              <h3 className="font-display text-lg text-ink">{item.title}</h3>
              {item.description && <p className="text-sm text-ink-soft">{item.description}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
