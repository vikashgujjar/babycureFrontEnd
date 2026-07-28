"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryParams } from "@/lib/hooks/use-query-params";
import { cn } from "@/lib/utils/cn";
import type { PaginationMeta } from "@/lib/types";

function pageRange(current: number, last: number): (number | "ellipsis")[] {
  const pages = new Set([1, last, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - (sorted[index - 1] as number) > 1) result.push("ellipsis");
    result.push(page);
  });

  return result;
}

export function Pagination({ meta }: { meta: PaginationMeta }) {
  const { set } = useQueryParams();

  if (meta.last_page <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-10" aria-label="Pagination">
      <button
        onClick={() => set({ page: meta.current_page - 1 })}
        disabled={meta.current_page <= 1}
        className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pageRange(meta.current_page, meta.last_page).map((page, index) =>
        page === "ellipsis" ? (
          <span key={`e-${index}`} className="px-1 text-ink-soft">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => set({ page })}
            aria-current={page === meta.current_page ? "page" : undefined}
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
              page === meta.current_page ? "bg-primary text-white" : "text-ink hover:bg-sand",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => set({ page: meta.current_page + 1 })}
        disabled={meta.current_page >= meta.last_page}
        className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
