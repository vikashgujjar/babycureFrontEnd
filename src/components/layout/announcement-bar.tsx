"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { PublicSettings } from "@/lib/types";

const DISMISS_KEY = "bc_announcement_dismissed";

export function AnnouncementBar({ announcement }: { announcement: PublicSettings["announcement_bar"] }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!announcement.enabled || !announcement.text || dismissed) return null;

  const style = {
    backgroundColor: announcement.background_color ?? undefined,
    color: announcement.text_color ?? undefined,
  };

  const content = announcement.link ? (
    <Link href={announcement.link} className="hover:underline">
      {announcement.text}
    </Link>
  ) : (
    announcement.text
  );

  return (
    <div
      style={style}
      className="relative flex items-center justify-center bg-primary px-10 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm"
    >
      {content}
      <button
        onClick={() => {
          window.sessionStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-80 transition-opacity hover:opacity-100"
        aria-label="Dismiss announcement"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
