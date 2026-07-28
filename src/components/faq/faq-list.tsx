"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn";
import type { Faq } from "@/lib/types";

export function FaqList({ faqs, categories }: { faqs: Faq[]; categories: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () => (active ? faqs.filter((faq) => faq.category === active) : faqs),
    [faqs, active],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            active === null ? "border-primary bg-primary-light text-primary-dark" : "border-line text-ink-soft hover:border-primary/50",
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === category
                ? "border-primary bg-primary-light text-primary-dark"
                : "border-line text-ink-soft hover:border-primary/50",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <Accordion>
        {visible.map((faq) => (
          <AccordionItem key={faq.id} question={faq.question}>
            {faq.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
