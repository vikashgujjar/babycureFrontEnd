import { Sparkles, Leaf, Droplet, ShieldCheck, Heart, Feather, ShieldAlert } from "lucide-react";
import type { Product } from "@/lib/types";

const FEATURE_ICONS = [Sparkles, Leaf, Droplet, ShieldCheck, Heart, Feather];

export function ProductInfoSections({ product }: { product: Product }) {
  const howToUseSteps = (product.how_to_use ?? "")
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);

  const safetyLines = (product.safety_information ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const hasFeatures = product.key_features.length > 0;
  const hasHowToUse = howToUseSteps.length > 0;
  const hasSpecs = product.specifications.length > 0;
  const hasSafety = safetyLines.length > 0;

  if (!hasFeatures && !hasHowToUse && !hasSpecs && !hasSafety) return null;

  return (
    <div className="flex flex-col gap-12">
      {hasFeatures && (
        <div>
          <h2 className="font-display mb-5 text-xl text-ink">Key Features</h2>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {product.key_features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <div key={index} className="flex items-start gap-3 rounded-xl bg-sand p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasHowToUse && (
        <div>
          <h2 className="font-display mb-5 text-xl text-ink">How to Use</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howToUseSteps.map((step, index) => (
              <li key={index} className="flex flex-col gap-2.5 rounded-xl border border-line p-4">
                <span className="font-display flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasSpecs && (
        <div>
          <h2 className="font-display mb-5 text-xl text-ink">Specifications</h2>
          <div className="overflow-hidden rounded-xl border border-line">
            <dl className="divide-y divide-line">
              {product.specifications.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${index % 2 === 1 ? "bg-sand/60" : "bg-white"}`}
                >
                  <dt className="text-ink-soft">{spec.label}</dt>
                  <dd className="font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {hasSafety && (
        <div className="flex gap-3.5 rounded-xl border border-warning/25 bg-warning/8 p-5">
          <ShieldAlert className="size-5 shrink-0 text-warning" strokeWidth={2} />
          <div>
            <h3 className="font-display mb-2 text-base text-ink">Safety Information</h3>
            <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
              {safetyLines.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-warning" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
