import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().max(50).optional().or(z.literal("")),
  full_name: z.string().trim().min(1, "Full name is required").max(150),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  address_line1: z.string().trim().min(1, "Address is required").max(255),
  address_line2: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  postal_code: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().max(2).optional().or(z.literal("")),
  is_default: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
