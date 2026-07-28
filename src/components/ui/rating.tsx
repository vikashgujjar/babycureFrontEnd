import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, count, size = "sm", className }: RatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-[1.125rem]";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => {
          const filled = index + 1 <= Math.round(value);
          return (
            <Star
              key={index}
              className={cn(starSize, filled ? "fill-warning text-warning" : "fill-transparent text-line")}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-ink-soft">({count})</span>
      )}
    </div>
  );
}
