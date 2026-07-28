"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice } from "@/lib/utils/format";
import type { DisplayCartLine } from "@/lib/providers/cart-provider";

interface CartLineItemProps {
  line: DisplayCartLine;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}

export function CartLineItem({ line, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const { product, variant } = line;
  const image = variant?.primary_image ?? product.featured_image;

  return (
    <div className="flex gap-4 border-b border-line py-5 last:border-0">
      <Link href={`/product/${product.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sand">
        {image && <Image src={image} alt={product.name} fill sizes="96px" className="object-cover" />}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/product/${product.slug}`} className="font-medium text-ink hover:text-primary">
          {product.name}
        </Link>
        {variant && <p className="text-sm text-ink-soft">{variant.label}</p>}
        <p className="text-sm text-ink-soft">{formatPrice(line.unitPrice)}</p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => onUpdateQuantity(line.key, quantity)}
            max={variant?.stock_quantity ?? 99}
          />
          <button
            onClick={() => onRemove(line.key)}
            className="flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" /> Remove
          </button>
        </div>
      </div>

      <span className="shrink-0 font-medium text-ink">{formatPrice(line.lineTotal)}</span>
    </div>
  );
}
