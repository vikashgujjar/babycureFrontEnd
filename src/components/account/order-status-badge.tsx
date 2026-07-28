import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";

const VARIANT_BY_STATUS: Record<OrderStatus, BadgeVariant> = {
  placed: "outline",
  payment_pending: "warning",
  payment_success: "default",
  packed: "default",
  ready_to_ship: "default",
  shipped: "default",
  out_for_delivery: "default",
  delivered: "success",
  returned: "warning",
  refunded: "warning",
  cancelled: "danger",
};

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return <Badge variant={VARIANT_BY_STATUS[status] ?? "outline"}>{label}</Badge>;
}
