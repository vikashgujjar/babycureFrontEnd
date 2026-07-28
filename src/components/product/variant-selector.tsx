import { cn } from "@/lib/utils/cn";
import type { ProductVariant } from "@/lib/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId: number | null;
  onChange: (variant: ProductVariant) => void;
  label?: string;
}

export function VariantSelector({ variants, selectedId, onChange, label = "Options" }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onChange(variant)}
            disabled={variant.stock_quantity <= 0}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              variant.id === selectedId
                ? "border-primary bg-primary-light text-primary-dark"
                : "border-line text-ink-soft hover:border-primary/50",
              variant.stock_quantity <= 0 && "cursor-not-allowed opacity-40",
            )}
          >
            {variant.label}
          </button>
        ))}
      </div>
    </div>
  );
}
