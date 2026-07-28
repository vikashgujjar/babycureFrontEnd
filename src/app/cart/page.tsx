"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CouponForm } from "@/components/cart/coupon-form";
import { useCartContext } from "@/lib/providers/cart-provider";
import { useCurrentCustomer } from "@/lib/api/mutations/auth";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const { lines, subtotal, discount, total, isLoading, updateItem, removeItem } = useCartContext();
  const { data: customer } = useCurrentCustomer();
  const router = useRouter();

  if (isLoading) return <Loader className="py-24" />;

  if (lines.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={<ButtonLink href="/shop">Start Shopping</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-10 lg:flex-row lg:items-start">
      <div className="flex-1">
        <h1 className="mb-6 font-display text-3xl text-ink">Your Cart</h1>
        <Card className="divide-y divide-line px-5">
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} onUpdateQuantity={updateItem} onRemove={removeItem} />
          ))}
        </Card>
      </div>

      <Card className="flex w-full flex-col gap-5 p-6 lg:w-96 lg:shrink-0">
        <h2 className="font-display text-lg text-ink">Order Summary</h2>
        <CouponForm />

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">{formatPrice(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-ink-soft">Discount</dt>
              <dd className="text-primary-dark">−{formatPrice(discount)}</dd>
            </div>
          )}
          <p className="text-xs text-ink-soft">Shipping and tax are calculated at checkout.</p>
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <Button
          size="lg"
          onClick={() => router.push(customer ? "/checkout" : "/account/login?redirect=/checkout")}
        >
          Proceed to Checkout
        </Button>
      </Card>
    </Container>
  );
}
