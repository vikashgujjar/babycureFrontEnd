import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

// Content-managed icon names (HomepageSectionItem.icon) occasionally
// reference brand glyphs lucide no longer ships (e.g. "instagram") — fall
// back to a generic equivalent instead of rendering nothing.
const FALLBACK_ALIASES: Record<string, IconName> = {
  instagram: "image",
};

export function ContentIcon({ name, className }: { name: string | null; className?: string }) {
  if (!name) return null;

  const resolved = (name in dynamicIconImports ? name : FALLBACK_ALIASES[name]) as IconName | undefined;

  if (!resolved) return null;

  return <DynamicIcon name={resolved} className={className} />;
}
