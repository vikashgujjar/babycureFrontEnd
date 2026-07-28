import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { AddressInput } from "@/lib/validation";
import type { ApiEnvelope, CustomerAddress } from "@/lib/types";

const addressKeys = {
  all: ["addresses"] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: () => unwrap(http.get<ApiEnvelope<CustomerAddress[]>>("/customer/addresses")),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddressInput) =>
      unwrap(http.post<ApiEnvelope<CustomerAddress>>("/customer/addresses", input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: AddressInput }) =>
      unwrap(http.put<ApiEnvelope<CustomerAddress>>(`/customer/addresses/${id}`, input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unwrap(http.delete(`/customer/addresses/${id}`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unwrap(http.post(`/customer/addresses/${id}/default`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
}
