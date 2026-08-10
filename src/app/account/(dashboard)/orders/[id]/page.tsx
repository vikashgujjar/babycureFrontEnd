"use client";

import { use } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { useOrder } from "@/lib/api/mutations/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <Loader />;
  if (!order) return <EmptyState title="Order not found" description="This order doesn't exist or isn't yours." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Order #{order.order_number}</h1>
          <p className="text-sm text-ink-soft">Placed on {formatDate(order.placed_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} label={order.status_label} />
      </div>

      {order.shipment?.delivered_at ? (
        <Card className="p-5">
          <p className="font-medium text-ink">Delivered</p>
          <p className="text-sm text-ink-soft">
            Your order was delivered on {formatDate(order.shipment.delivered_at)}
            {order.shipment.courier_name ? ` via ${order.shipment.courier_name}` : ""}.
          </p>
        </Card>
      ) : order.shipment?.tracking_url ? (
        <Card className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-medium text-ink">{order.shipment.courier_name ?? "Shipment"} in transit</p>
            <p className="text-sm text-ink-soft">AWB: {order.shipment.awb_code}</p>
          </div>
          <Link
            href={order.shipment.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Track Package <ExternalLink className="size-3.5" />
          </Link>
        </Card>
      ) : order.shipment?.last_error ? (
        <Card className="p-5">
          <p className="font-medium text-ink">We&apos;re working on shipping this</p>
          <p className="text-sm text-ink-soft">
            There was a hiccup preparing your shipment — our team has been notified and will sort it out shortly.
          </p>
        </Card>
      ) : null}

      <Card className="p-5">
        <h2 className="mb-4 font-medium text-ink">Items</h2>
        <ul className="flex flex-col divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{item.product_name}</p>
                {item.variant_label && <p className="text-xs text-ink-soft">{item.variant_label}</p>}
                <p className="text-xs text-ink-soft">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-ink">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-medium text-ink">Order Summary</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount_amount && Number(order.discount_amount) > 0 && (
            <div className="flex justify-between">
              <dt className="text-ink-soft">Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</dt>
              <dd className="text-primary-dark">−{formatPrice(order.discount_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="text-ink">{formatPrice(order.shipping_amount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Tax</dt>
            <dd className="text-ink">{formatPrice(order.tax_amount)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="text-ink">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-medium text-ink">Shipping Address</h2>
        <p className="text-sm text-ink-soft">
          {order.shipping_address.full_name}
          <br />
          {order.shipping_address.address_line1}
          {order.shipping_address.address_line2 ? `, ${order.shipping_address.address_line2}` : ""}
          <br />
          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
          <br />
          {order.shipping_address.phone}
        </p>
      </Card>

      {order.timeline.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 font-medium text-ink">Order Timeline</h2>
          <ul className="flex flex-col gap-4">
            {order.timeline.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-ink">{entry.label}</p>
                  {entry.note && <p className="text-xs text-ink-soft">{entry.note}</p>}
                  <p className="text-xs text-ink-soft">{formatDate(entry.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
