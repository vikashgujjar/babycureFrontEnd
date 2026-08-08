import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ContentIcon } from "@/lib/utils/dynamic-icon";
import type { HomepageSectionItem } from "@/lib/types";

const ACCENTS = [
  { bg: "bg-accent-light", text: "text-accent" },
  { bg: "bg-primary-light", text: "text-primary" },
] as const;

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <WhyChooseUsCard key={item.id} item={item} accent={ACCENTS[index % ACCENTS.length]} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function WhyChooseUsCard({
  item,
  accent,
}: {
  item: HomepageSectionItem;
  accent: (typeof ACCENTS)[number];
}) {
  const content = (
    <>
      {item.thumbnail ? (
        <div className={`relative size-16 overflow-hidden rounded-full ${accent.bg}`}>
          <Image src={item.thumbnail} alt="" fill sizes="64px" className="object-cover" />
        </div>
      ) : (
        <div className={`flex size-16 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}>
          <ContentIcon name={item.icon} className="size-7" />
        </div>
      )}
      <div className="flex flex-col items-center gap-1.5">
        <h3 className={`font-display text-lg font-bold ${accent.text}`}>{item.title}</h3>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="h-px w-4 bg-current opacity-40" aria-hidden />
          <Heart className="size-3 fill-current" aria-hidden />
          <span className="h-px w-4 bg-current opacity-40" aria-hidden />
        </span>
      </div>
      {item.description && <p className="text-sm text-ink-soft">{item.description}</p>}
    </>
  );

  const cardClass =
    "group flex flex-col items-center gap-3 rounded-3xl border border-line/60 bg-white p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift";

  if (item.link) {
    return (
      <Link href={item.link} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
