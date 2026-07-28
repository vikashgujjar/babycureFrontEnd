"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useCartContext } from "@/lib/providers/cart-provider";
import { formatPrice } from "@/lib/utils/format";

export function OrderSummary() {
  const { lines, subtotal, discount, total, couponCode } = useCartContext();

  return (
    <Card className="flex flex-col gap-5 p-6">
      <h2 className="font-display text-lg text-ink">Order Summary</h2>

      <ul className="flex flex-col gap-3">
        {lines.map((line) => {
          const image = line.variant?.primary_image ?? line.product.featured_image;
          return (
            <li key={line.key} className="flex items-center gap-3">
              <div className="relative">
                
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                {image && <Image src={image} alt={line.product.name} fill sizes="56px" className="object-cover" />}
              </div>
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="line-clamp-1 text-sm font-medium text-ink">{line.product.name}</p>
                {line.variant && <p className="text-xs text-ink-soft">{line.variant.label}</p>}
              </div>
              <span className="shrink-0 text-sm font-medium text-ink">{formatPrice(line.lineTotal)}</span>
            </li>
          );
        })}
      </ul>

      <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="text-ink">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-soft">Discount {couponCode ? `(${couponCode})` : ""}</dt>
            <dd className="text-primary-dark">−{formatPrice(discount)}</dd>
          </div>
        )}
        <p className="text-xs text-ink-soft">Shipping and tax are calculated on the next step.</p>
        <div className="mt-1 flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt className="text-ink">Total</dt>
          <dd className="text-ink">{formatPrice(total)}</dd>
        </div>
      </dl>
    </Card>
  );
}
