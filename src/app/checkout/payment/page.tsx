"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/toast";
import { OrderSummary } from "@/components/checkout/order-summary";
import { usePlaceOrder } from "@/lib/api/mutations/checkout";
import { useCartContext } from "@/lib/providers/cart-provider";
import { clearCheckoutAddressId, getCheckoutAddressId } from "@/lib/checkout/session";
import { cn } from "@/lib/utils/cn";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", description: "Pay in cash when your order arrives.", icon: Banknote },
  { value: "razorpay", label: "Pay Online (Razorpay)", description: "Card, UPI, or netbanking.", icon: CreditCard },
] as const;

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { lines, isLoading: isCartLoading } = useCartContext();
  const placeOrder = usePlaceOrder();

  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["value"]>("cod");
  const [notes, setNotes] = useState("");

  // Placing an order clears the cart server-side, which would otherwise
  // make the "empty cart" effect below fire and redirect to /cart in a race
  // against the success redirect below it — this flag tells that effect the
  // emptiness is expected, not a reason to bounce the user away.
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    const id = getCheckoutAddressId();
    if (!id) {
      router.replace("/checkout");
      return;
    }
    setAddressId(id);
  }, [router]);

  useEffect(() => {
    if (!orderPlacedRef.current && !isCartLoading && lines.length === 0) router.replace("/cart");
  }, [isCartLoading, lines.length, router]);

  if (isCartLoading || !addressId) return <Loader className="py-24" />;

  function handlePlaceOrder() {
    if (!addressId) return;

    placeOrder.mutate(
      { customer_address_id: addressId, payment_method: paymentMethod, notes: notes || undefined },
      {
        onSuccess: (order) => {
          orderPlacedRef.current = true;
          clearCheckoutAddressId();
          router.push(`/order/success/${order.id}`);
        },
        onError: (error) => toast({ title: "Couldn't place order", description: error.message, variant: "error" }),
      },
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-10 lg:flex-row lg:items-start">
      <div className="flex-1">
        <h1 className="mb-6 font-display text-3xl text-ink">Payment</h1>
        <h2 className="mb-4 font-medium text-ink">Payment Method</h2>

        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.value} className="block cursor-pointer">
              <Card
                className={cn(
                  "flex items-center gap-3 p-4 transition-colors",
                  paymentMethod === method.value ? "border-primary bg-primary-light/40" : "hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                  className="size-4 accent-primary"
                />
                <method.icon className="size-5 text-ink-soft" />
                <div className="text-sm">
                  <p className="font-medium text-ink">{method.label}</p>
                  <p className="text-ink-soft">{method.description}</p>
                </div>
              </Card>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <Textarea
            label="Order Notes (optional)"
            placeholder="Delivery instructions, gift note, etc."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <Button size="lg" className="mt-8" isLoading={placeOrder.isPending} onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>

      <div className="w-full lg:w-96 lg:shrink-0">
        <OrderSummary />
      </div>
    </Container>
  );
}
