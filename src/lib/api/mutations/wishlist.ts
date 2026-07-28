import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { ApiEnvelope, WishlistEntry } from "@/lib/types";
import { getSessionToken } from "@/lib/auth/session";

const wishlistKeys = {
  all: ["wishlist"] as const,
};

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: () => unwrap(http.get<ApiEnvelope<WishlistEntry[]>>("/customer/wishlist")),
    enabled: Boolean(getSessionToken()),
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      unwrap(http.post("/customer/wishlist", { product_id: productId })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => unwrap(http.delete(`/customer/wishlist/${productId}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}
