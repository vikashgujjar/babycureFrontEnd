"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "bc_recently_viewed";
const MAX_ITEMS = 10;

function readStorage(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

/** Recently-viewed products are a browser-affinity feature — kept in
 * localStorage for both guests and signed-in customers alike rather than
 * wired to the backend's authenticated-only recently-viewed endpoints,
 * since there's no cross-device requirement here. */
export function useRecordRecentlyViewed(product: Product) {
  useEffect(() => {
    const current = readStorage().filter((p) => p.id !== product.id);
    const next = [product, ...current].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [product]);
}

export function useRecentlyViewed(excludeId?: number) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(readStorage().filter((p) => p.id !== excludeId));
  }, [excludeId]);

  return products;
}
