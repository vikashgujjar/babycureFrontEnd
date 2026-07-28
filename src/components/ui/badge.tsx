import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary-light text-primary-dark",
  accent: "bg-accent text-white",
  // Semantically green regardless of what hue --color-primary happens to be
  // — was aliased to primary back when primary itself was green.
  success: "bg-accent-light text-accent-dark",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
  outline: "border border-line text-ink-soft",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-tight",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
