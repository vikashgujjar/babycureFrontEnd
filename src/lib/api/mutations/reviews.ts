import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { ReviewInput } from "@/lib/validation";
import type { ApiEnvelope, Review } from "@/lib/types";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewInput) =>
      unwrap(http.post<ApiEnvelope<Review>>("/customer/reviews", input)),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", review.product_id] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<ReviewInput> }) =>
      unwrap(http.put<ApiEnvelope<Review>>(`/customer/reviews/${id}`, input)),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", review.product_id] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; productId: number }) =>
      unwrap(http.delete(`/customer/reviews/${id}`)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
    },
  });
}
