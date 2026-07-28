import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ContentIcon } from "@/lib/utils/dynamic-icon";
import type { HomepageSectionItem } from "@/lib/types";

export function TrustIcons({ title, items }: { title: string | null; items: HomepageSectionItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={title} />
        <div className="flex gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex w-32 shrink-0 flex-col items-center gap-3 text-center sm:w-auto"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                <ContentIcon name={item.icon} className="size-6" />
              </div>
              <span className="text-sm font-medium text-ink">{item.title}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
