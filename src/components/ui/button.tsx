import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-soft disabled:bg-primary/50",
  secondary:
    "bg-sand text-ink hover:bg-sand-dark disabled:opacity-50",
  outline:
    "border border-line bg-transparent text-ink hover:border-primary hover:text-primary disabled:opacity-50",
  ghost: "bg-transparent text-ink hover:bg-sand disabled:opacity-50",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/50",
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2",
  icon: "h-11 w-11",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-colors duration-200",
    "disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
    variant !== "link" && buttonSizeClasses[size],
    buttonVariantClasses[variant],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName(variant, size, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
