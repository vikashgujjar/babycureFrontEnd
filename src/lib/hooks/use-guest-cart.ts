"use client";

import { useCallback, useEffect, useState } from "react";
import { GUEST_CART_STORAGE_KEY } from "@/lib/constants";
import type { Product, ProductVariant } from "@/lib/types";

export interface GuestCartLine {
  key: string;
  product_id: number;
  product_variant_id: number | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

function lineKey(productId: number, variantId: number | null) {
  return `${productId}:${variantId ?? "base"}`;
}

function readStorage(): GuestCartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestCartLine[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(lines: GuestCartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(lines));
}

/** Backend cart/wishlist/checkout endpoints all require an authenticated
 * customer, so guests get a localStorage cart with the same add/update/
 * remove/clear shape — synced to the real backend cart right after login
 * or registration succeeds (see CartProvider). */
export function useGuestCart() {
  const [lines, setLines] = useState<GuestCartLine[]>([]);

  useEffect(() => {
    setLines(readStorage());

    function onStorage(event: StorageEvent) {
      if (event.key === GUEST_CART_STORAGE_KEY) setLines(readStorage());
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: GuestCartLine[]) => {
    setLines(next);
    writeStorage(next);
  }, []);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant | null, quantity: number) => {
      const variantId = variant?.id ?? null;
      const key = lineKey(product.id, variantId);

      persist(
        (() => {
          const current = readStorage();
          const existing = current.find((line) => line.key === key);

          if (existing) {
            return current.map((line) =>
              line.key === key ? { ...line, quantity: line.quantity + quantity } : line,
            );
          }

          return [
            ...current,
            { key, product_id: product.id, product_variant_id: variantId, quantity, product, variant },
          ];
        })(),
      );
    },
    [persist],
  );

  const updateItem = useCallback(
    (key: string, quantity: number) => {
      const current = readStorage();
      persist(
        quantity <= 0
          ? current.filter((line) => line.key !== key)
          : current.map((line) => (line.key === key ? { ...line, quantity } : line)),
      );
    },
    [persist],
  );

  const removeItem = useCallback(
    (key: string) => {
      persist(readStorage().filter((line) => line.key !== key));
    },
    [persist],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return { lines, addItem, updateItem, removeItem, clear };
}
