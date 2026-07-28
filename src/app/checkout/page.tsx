"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AddressSelector } from "@/components/checkout/address-selector";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartContext } from "@/lib/providers/cart-provider";
import { setCheckoutAddressId } from "@/lib/checkout/session";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, isLoading } = useCartContext();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && lines.length === 0) router.replace("/cart");
  }, [isLoading, lines.length, router]);

  if (isLoading) return <Loader className="py-24" />;
  if (lines.length === 0) return null;

  return (
    <Container className="flex flex-col gap-8 py-10 lg:flex-row lg:items-start">
      <div className="flex-1">
        <h1 className="mb-6 font-display text-3xl text-ink">Checkout</h1>
        <h2 className="mb-4 font-medium text-ink">Shipping Address</h2>
        <AddressSelector selectedId={selectedAddressId} onSelect={setSelectedAddressId} />

        <Button
          size="lg"
          className="mt-8"
          disabled={!selectedAddressId}
          onClick={() => {
            if (!selectedAddressId) return;
            setCheckoutAddressId(selectedAddressId);
            router.push("/checkout/payment");
          }}
        >
          Continue to Payment <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="w-full lg:w-96 lg:shrink-0">
        <OrderSummary />
      </div>
    </Container>
  );
}
