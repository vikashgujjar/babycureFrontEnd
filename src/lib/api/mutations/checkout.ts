import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { PlaceOrderInput } from "@/lib/validation";
import type { ApiEnvelope, Order, PlaceOrderResponse } from "@/lib/types";
import { cartKeys } from "@/lib/api/mutations/cart";
import { orderKeys } from "@/lib/api/mutations/orders";

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) =>
      unwrap(http.post<ApiEnvelope<PlaceOrderResponse>>("/customer/checkout", input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

interface VerifyRazorpayPaymentInput {
  paymentId: number;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Confirms a Razorpay Checkout.js success callback with the backend, which
 * verifies the HMAC signature server-side before marking the order paid. */
export function useVerifyRazorpayPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, ...body }: VerifyRazorpayPaymentInput) =>
      unwrap(http.post<ApiEnvelope<Order>>(`/customer/payments/${paymentId}/verify`, body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

interface CouponValidationResponse {
  code: string;
  valid: boolean;
  message: string;
  discount_amount?: string;
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (input: { code: string; cart_total: number; product_ids?: number[] }) =>
      unwrap(
        http.post<ApiEnvelope<CouponValidationResponse>>("/customer/coupons/validate", input),
      ),
  });
}
