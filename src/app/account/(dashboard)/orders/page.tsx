"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { useOrders } from "@/lib/api/mutations/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-ink">My Orders</h1>
        <p className="text-sm text-ink-soft">Track and review your past orders.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your placed orders will show up here."
          action={<ButtonLink href="/shop">Start Shopping</ButtonLink>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-primary/40">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-ink">#{order.order_number}</span>
                  <span className="text-xs text-ink-soft">{formatDate(order.placed_at)}</span>
                </div>
                <OrderStatusBadge status={order.status} label={order.status_label} />
                <span className="hidden text-sm font-medium text-ink sm:block">{formatPrice(order.total)}</span>
                <ChevronRight className="size-4 text-ink-soft" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
