"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentCustomer } from "@/lib/api/mutations/auth";
import {
  useAddCartItem,
  useApplyCartCoupon,
  useCart,
  useClearCart,
  useRemoveCartCoupon,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/lib/api/mutations/cart";
import { useGuestCart, type GuestCartLine } from "@/lib/hooks/use-guest-cart";
import { toNumber } from "@/lib/utils/format";
import type { Product, ProductVariant } from "@/lib/types";

export interface DisplayCartLine {
  key: string;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface CartContextValue {
  isGuest: boolean;
  isLoading: boolean;
  lines: DisplayCartLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  addItem: (product: Product, variant: ProductVariant | null, quantity: number) => void;
  updateItem: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function guestLineToDisplay(line: GuestCartLine): DisplayCartLine {
  const unitPrice = line.variant?.effective_price ?? line.product.effective_price;

  return {
    key: line.key,
    product: line.product,
    variant: line.variant,
    quantity: line.quantity,
    unitPrice,
    lineTotal: unitPrice * line.quantity,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: customer } = useCurrentCustomer();
  const isAuthenticated = Boolean(customer);

  const guest = useGuestCart();
  const { data: cart, isLoading: isCartLoading } = useCart();

  const addCartItem = useAddCartItem();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const applyCartCoupon = useApplyCartCoupon();
  const removeCartCoupon = useRemoveCartCoupon();

  const [isSyncing, setIsSyncing] = useState(false);
  const hasSynced = useRef(false);

  // The moment a guest becomes authenticated, push their localStorage lines
  // into the real backend cart (sequentially — the API has no batch-add
  // endpoint), then wipe local storage so it never double-applies.
  useEffect(() => {
    if (!isAuthenticated || hasSynced.current || guest.lines.length === 0) return;

    hasSynced.current = true;
    setIsSyncing(true);

    (async () => {
      for (const line of guest.lines) {
        try {
          await addCartItem.mutateAsync({
            product_id: line.product_id,
            product_variant_id: line.product_variant_id,
            quantity: line.quantity,
          });
        } catch {
          // Best-effort: skip lines the backend rejects (out of stock, etc.)
          // rather than blocking the rest of the sync.
        }
      }

      guest.clear();
      setIsSyncing(false);
    })();
  }, [isAuthenticated, guest.lines, addCartItem, guest]);

  const value = useMemo<CartContextValue>(() => {
    if (isAuthenticated) {
      const lines: DisplayCartLine[] = (cart?.items ?? []).map((item) => ({
        key: String(item.id),
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: toNumber(item.unit_price),
        lineTotal: toNumber(item.line_total),
      }));

      return {
        isGuest: false,
        isLoading: isCartLoading || isSyncing,
        lines,
        itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal: toNumber(cart?.subtotal),
        discount: toNumber(cart?.discount),
        total: toNumber(cart?.total),
        couponCode: cart?.coupon_code ?? null,
        addItem: (product, variant, quantity) => {
          addCartItem.mutate({ product_id: product.id, product_variant_id: variant?.id, quantity });
        },
        updateItem: (key, quantity) => {
          updateCartItem.mutate({ itemId: Number(key), quantity });
        },
        removeItem: (key) => removeCartItem.mutate(Number(key)),
        clear: () => clearCart.mutate(),
        applyCoupon: async (code) => {
          try {
            await applyCartCoupon.mutateAsync(code);
            return { ok: true, message: "Coupon applied." };
          } catch (error) {
            return { ok: false, message: error instanceof Error ? error.message : "Invalid coupon." };
          }
        },
        removeCoupon: () => removeCartCoupon.mutate(),
      };
    }

    const lines = guest.lines.map(guestLineToDisplay);
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

    return {
      isGuest: true,
      isLoading: false,
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      discount: 0,
      total: subtotal,
      couponCode: null,
      addItem: guest.addItem,
      updateItem: guest.updateItem,
      removeItem: guest.removeItem,
      clear: guest.clear,
      applyCoupon: async () => ({
        ok: false,
        message: "Sign in to apply a coupon code.",
      }),
      removeCoupon: () => undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, cart, isCartLoading, isSyncing, guest.lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
}

/** The cart line for this exact product+variant combo, if it's already in the cart. */
export function useCartLine(productId: number, variantId?: number | null) {
  const { lines } = useCartContext();
  return lines.find(
    (line) => line.product.id === productId && (line.variant?.id ?? null) === (variantId ?? null),
  );
}
