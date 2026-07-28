"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const { toast } = useToast();

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: "Product link copied to clipboard.", variant: "success" });
  }

  return (
    <button
      onClick={share}
      className={className ?? "flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"}
    >
      <Share2 className="size-4" /> Share
    </button>
  );
}
