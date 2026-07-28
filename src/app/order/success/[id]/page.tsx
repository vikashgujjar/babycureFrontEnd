"use client";

import { use } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { ButtonLink } from "@/components/ui/button-link";
import { useOrder } from "@/lib/api/mutations/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <Loader className="py-24" />;

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <p className="text-ink-soft">We couldn&apos;t find that order.</p>
        <ButtonLink href="/account/orders" className="mt-4">
          View My Orders
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="flex justify-center py-14">
      <Card className="flex w-full max-w-lg flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="size-14 text-primary" />
        <h1 className="font-display text-2xl text-ink">Order Placed Successfully!</h1>
        <p className="text-sm text-ink-soft">
          Thank you for your order. A confirmation has been sent to your email.
        </p>

        <div className="mt-2 w-full rounded-2xl bg-sand p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Order Number</span>
            <span className="font-medium text-ink">#{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Placed On</span>
            <span className="font-medium text-ink">{formatDate(order.placed_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Payment Method</span>
            <span className="font-medium text-ink uppercase">{order.payment_method}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold">
            <span className="text-ink">Total</span>
            <span className="text-ink">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-2 flex w-full gap-3">
          <ButtonLink href={`/account/orders/${order.id}`} variant="outline" className="flex-1">
            View Order
          </ButtonLink>
          <ButtonLink href="/shop" className="flex-1">
            Continue Shopping
          </ButtonLink>
        </div>
      </Card>
    </Container>
  );
}
