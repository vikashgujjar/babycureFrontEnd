import type { Product } from "./catalog";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: "active" | "inactive";
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface CustomerAddress {
  id: number;
  label: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface WishlistEntry {
  id: number;
  product: Product;
  added_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  variant: import("./catalog").ProductVariant | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface CartSummary {
  id: number;
  items: CartItem[];
  coupon_code: string | null;
  subtotal: string;
  discount: string;
  total: string;
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  variant_label: string | null;
  sku: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export type OrderStatus =
  | "placed"
  | "payment_pending"
  | "payment_success"
  | "packed"
  | "ready_to_ship"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "refunded"
  | "cancelled";

export interface OrderTimelineEntry {
  id: number;
  status: OrderStatus;
  label: string;
  note: string | null;
  created_at: string;
}

export interface Address {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer?: { id: number; name: string; email: string };
  shipping_address: Address;
  billing_address: Address | null;
  subtotal: string;
  discount_amount: string;
  shipping_amount: string;
  tax_amount: string;
  total: string;
  coupon_code: string | null;
  payment_method: string;
  status: OrderStatus;
  status_label: string;
  notes: string | null;
  placed_at: string;
  items: OrderItem[];
  timeline: OrderTimelineEntry[];
  shipment?: {
    // Admin-only fields — always null on the customer storefront.
    shiprocket_order_id: number | null;
    last_error: string | null;
    retry_count: number | null;
    awb_code: string | null;
    courier_name: string | null;
    courier_company_id: string | null;
    tracking_url: string | null;
    tracking_available: boolean;
    status: string | null;
    shipment_created_at: string | null;
    awb_assigned_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
  } | null;
  payment?: {
    gateway: string;
    status: string;
    status_label: string;
    transaction_reference: string | null;
    amount: string;
    created_at: string;
  } | null;
}

export interface OrderPayment {
  id: number;
  order_id: number;
  order_number: string | null;
  gateway: string;
  transaction_reference: string | null;
  amount: string;
  status: string;
  /** Razorpay's public Key ID, present only while a Razorpay payment is awaiting confirmation. */
  key_id: string | null;
  created_at: string;
}

export interface PlaceOrderResponse {
  order: Order;
  payment: OrderPayment | null;
}

export interface PlaceOrderPayload {
  customer_address_id?: number;
  shipping_address?: Address;
  billing_address?: Address;
  payment_method: string;
  notes?: string;
}

export interface CouponValidation {
  code: string;
  valid: boolean;
  message: string;
  discount_amount?: string;
}
