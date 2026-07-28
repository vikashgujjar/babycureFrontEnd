import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const checkboxId = id ?? props.name;

    return (
      <label
        htmlFor={checkboxId}
        className={cn("inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink", className)}
      >
        <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border border-line bg-paper transition-colors checked:border-primary checked:bg-primary"
            {...props}
          />
          <Check
            className="pointer-events-none relative size-3.5 text-white opacity-0 peer-checked:opacity-100"
            aria-hidden
          />
        </span>
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
