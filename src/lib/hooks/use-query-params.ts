"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Shop/Category/Search filters all live in the URL (so they're shareable
 * and back-button-friendly) rather than component state — this centralizes
 * the read/update logic so every filter control shares one pattern.
 */
export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback((key: string) => searchParams.get(key), [searchParams]);
  const getAll = useCallback((key: string) => searchParams.getAll(key), [searchParams]);

  const set = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // Any filter change resets pagination back to page 1.
      if (!("page" in updates)) params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggleInList = useCallback(
    (key: string, value: string) => {
      const current = searchParams.getAll(key);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);

      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      next.forEach((v) => params.append(key, v));
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const clear = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { get, getAll, set, toggleInList, clear, searchParams };
}
