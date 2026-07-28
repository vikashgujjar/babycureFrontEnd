"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCartContext } from "@/lib/providers/cart-provider";

export function CouponForm() {
  const { couponCode, applyCoupon, removeCoupon, isGuest } = useCartContext();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-primary-light px-4 py-2.5 text-sm">
        <span className="font-medium text-primary-dark">Coupon &ldquo;{couponCode}&rdquo; applied</span>
        <button onClick={removeCoupon} className="font-medium text-primary-dark underline-offset-2 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!code.trim()) return;
        setIsApplying(true);
        const result = await applyCoupon(code.trim());
        setIsApplying(false);
        toast({ title: result.ok ? "Coupon applied" : "Invalid coupon", description: result.message, variant: result.ok ? "success" : "error" });
        if (result.ok) setCode("");
      }}
      className="flex items-center gap-2"
    >
      <Input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder={isGuest ? "Sign in at checkout to apply a coupon" : "Coupon code"}
        disabled={isGuest}
        className="h-10"
      />
      <Button type="submit" variant="outline" size="sm" isLoading={isApplying} disabled={isGuest}>
        Apply
      </Button>
    </form>
  );
}
