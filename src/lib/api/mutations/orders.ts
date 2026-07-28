import { useQuery } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { ApiEnvelope, Order } from "@/lib/types";
import { getSessionToken } from "@/lib/auth/session";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: number | string) => ["orders", id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: () => unwrap(http.get<ApiEnvelope<Order[]>>("/customer/orders")),
    enabled: Boolean(getSessionToken()),
  });
}

export function useOrder(id: number | string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => unwrap(http.get<ApiEnvelope<Order>>(`/customer/orders/${id}`)),
    enabled: Boolean(getSessionToken()) && Boolean(id),
  });
}
