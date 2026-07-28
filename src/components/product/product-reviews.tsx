"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/empty-state";
import { useCurrentCustomer } from "@/lib/api/mutations/auth";
import { useCreateReview } from "@/lib/api/mutations/reviews";
import { useToast } from "@/components/ui/toast";
import { reviewSchema, type ReviewInput } from "@/lib/validation";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { RatingSummary } from "@/lib/api/queries/catalog";
import type { Review } from "@/lib/types";

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2 text-xs text-ink-soft">
      <span className="w-10 shrink-0">{star} star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-6 shrink-0 text-right">{count}</span>
    </div>
  );
}

function ReviewForm({ productId }: { productId: number }) {
  const { toast } = useToast();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { product_id: productId, rating: 5 },
  });

  function onSubmit(input: ReviewInput) {
    createReview.mutate(
      { ...input, rating },
      {
        onSuccess: () => {
          toast({
            title: "Review submitted",
            description: "Thanks! It'll appear once our team approves it.",
            variant: "success",
          });
          reset();
          setRating(5);
        },
        onError: (error) => toast({ title: "Couldn't submit review", description: error.message, variant: "error" }),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} stars`}>
            <Star
              className={cn("size-6 transition-colors", star <= rating ? "fill-accent text-accent" : "text-line")}
            />
          </button>
        ))}
      </div>
      <Textarea
        {...register("comment")}
        placeholder="Share your experience with this product…"
        error={errors.comment?.message}
      />
      <Button type="submit" isLoading={createReview.isPending} className="w-fit">
        Submit Review
      </Button>
    </form>
  );
}

export function ProductReviews({
  productId,
  reviews,
  summary,
}: {
  productId: number;
  reviews: Review[];
  summary: RatingSummary;
}) {
  const { data: customer } = useCurrentCustomer();

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl text-ink">{summary.average ?? "—"}</span>
          <span className="text-sm text-ink-soft">out of 5</span>
        </div>
        <Rating value={summary.average ?? 0} count={summary.count} size="md" />
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar key={star} star={star} count={summary.breakdown[String(star)] ?? 0} total={summary.count} />
          ))}
        </div>

        {customer ? (
          <ReviewForm productId={productId} />
        ) : (
          <p className="text-sm text-ink-soft">Sign in to write a review for this product.</p>
        )}
      </div>

      <div className="flex-1">
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to share your experience." />
        ) : (
          <ul className="flex flex-col gap-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-line pb-6 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <Rating value={review.rating} />
                  <span className="text-xs text-ink-soft">{formatDate(review.created_at)}</span>
                </div>
                {review.title && <p className="mt-2 font-medium text-ink">{review.title}</p>}
                {review.comment && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.comment}</p>}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
                  <span>{review.customer_name ?? "Verified Customer"}</span>
                  {review.is_verified_purchase && (
                    <span className="flex items-center gap-1 text-primary">
                      <BadgeCheck className="size-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
