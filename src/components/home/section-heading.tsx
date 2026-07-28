import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  title: string | null;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  align = "center",
  className,
}: SectionHeadingProps) {
  if (!title && !subtitle && !description) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {subtitle && (
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">{subtitle}</span>
      )}
      {title && <h2 className="max-w-xl text-3xl text-ink sm:text-4xl">{title}</h2>}
      {description && <p className="max-w-xl text-sm text-ink-soft sm:text-base">{description}</p>}
      {buttonText && buttonLink && (
        <ButtonLink href={buttonLink} variant="outline" size="md" className="mt-2">
          {buttonText}
          <ArrowRight className="size-4" />
        </ButtonLink>
      )}
    </div>
  );
}
