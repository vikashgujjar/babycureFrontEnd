import { z } from "zod";

export const reviewSchema = z.object({
  product_id: z.number().int(),
  rating: z.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(150).optional().or(z.literal("")),
  comment: z.string().trim().min(1, "Write a review before submitting").max(2000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
