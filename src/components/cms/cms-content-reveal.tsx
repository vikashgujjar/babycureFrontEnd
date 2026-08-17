"use client";

import { useEffect, useRef } from "react";

/**
 * Renders raw CMS HTML and fades/slides each top-level block in as it
 * scrolls into view (targets .about-content > * — see the matching
 * transition rules in globals.css). A plain IntersectionObserver rather
 * than framer-motion since the content is injected HTML, not React
 * elements framer-motion could wrap directly. Shared by every rich
 * editorial CMS page (About Us, Why Choose Us, ...), not just About.
 */
export function CmsContentReveal({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const sections = Array.from(container.children);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [html]);

  return <div ref={ref} className="cms-content about-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
