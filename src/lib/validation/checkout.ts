import { z } from "zod";

const shippingAddressSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(150),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  address_line1: z.string().trim().min(1, "Address is required").max(255),
  address_line2: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  postal_code: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().max(2).optional().or(z.literal("")),
});

export const placeOrderSchema = z.object({
  customer_address_id: z.number().int().optional(),
  shipping_address: shippingAddressSchema.optional(),
  billing_address: shippingAddressSchema.partial().optional(),
  payment_method: z.string().min(1, "Select a payment method"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
