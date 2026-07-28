"use client";

import { Truck, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button-link";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { useCurrentCustomer } from "@/lib/api/mutations/auth";
import { useOrders } from "@/lib/api/mutations/orders";
import { formatDate } from "@/lib/utils/format";

export default function OrderTrackingPage() {
  const { data: customer, isLoading: isAuthLoading } = useCurrentCustomer();
  const { data: orders, isLoading: isOrdersLoading } = useOrders();

  if (isAuthLoading) return <Loader className="py-24" />;

  if (!customer) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={Truck}
          title="Sign in to track your order"
          description="Track your order's live shipment status once you're signed in."
          action={<ButtonLink href="/account/login?redirect=/order/track">Sign In</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-6 py-10">
      <div>
        <h1 className="font-display text-3xl text-ink">Track Your Order</h1>
        <p className="text-sm text-ink-soft">Select an order below to follow its live shipment status.</p>
      </div>

      {isOrdersLoading ? (
        <Loader />
      ) : !orders || orders.length === 0 ? (
        <EmptyState icon={Truck} title="No orders yet" action={<ButtonLink href="/shop">Start Shopping</ButtonLink>} />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-ink">#{order.order_number}</p>
                <p className="text-xs text-ink-soft">Placed {formatDate(order.placed_at)}</p>
              </div>
              <OrderStatusBadge status={order.status} label={order.status_label} />
              {order.shipment?.tracking_url ? (
                <a
                  href={order.shipment.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Track Shipment <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span className="text-sm text-ink-soft">Not shipped yet</span>
              )}
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
