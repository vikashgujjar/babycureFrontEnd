import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { ApiEnvelope, CartSummary } from "@/lib/types";
import { getSessionToken } from "@/lib/auth/session";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => unwrap(http.get<ApiEnvelope<CartSummary>>("/customer/cart")),
    enabled: Boolean(getSessionToken()),
  });
}

interface AddCartItemInput {
  product_id: number;
  product_variant_id?: number | null;
  quantity: number;
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCartItemInput) =>
      unwrap(http.post<ApiEnvelope<CartSummary>>("/customer/cart/items", input)),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      unwrap(http.put<ApiEnvelope<CartSummary>>(`/customer/cart/items/${itemId}`, { quantity })),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) =>
      unwrap(http.delete<ApiEnvelope<CartSummary>>(`/customer/cart/items/${itemId}`)),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrap(http.delete<ApiEnvelope<CartSummary>>("/customer/cart")),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}

export function useApplyCartCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) =>
      unwrap(http.post<ApiEnvelope<CartSummary>>("/customer/cart/coupon", { code })),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}

export function useRemoveCartCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrap(http.delete<ApiEnvelope<CartSummary>>("/customer/cart/coupon")),
    onSuccess: (cart) => queryClient.setQueryData(cartKeys.all, cart),
  });
}
