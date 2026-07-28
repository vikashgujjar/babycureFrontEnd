import type { Metadata } from "next";
import { getFaqCategories, getFaqs } from "@/lib/api/queries/content";
import { Container } from "@/components/ui/container";
import { FaqList } from "@/components/faq/faq-list";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about shipping, orders, returns, and our products.",
};

export default async function FaqPage() {
  const [faqs, categories] = await Promise.all([
    getFaqs().catch(() => []),
    getFaqCategories().catch(() => []),
  ]);

  return (
    <Container className="max-w-3xl py-14">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-2 text-ink-soft">Everything you need to know about shopping with us.</p>
      </div>

      <FaqList faqs={faqs} categories={categories} />
    </Container>
  );
}
