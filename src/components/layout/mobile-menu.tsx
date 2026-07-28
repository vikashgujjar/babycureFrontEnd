"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils/cn";
import type { MenuItem } from "@/lib/types";

function MobileMenuItem({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <div className="border-b border-line">
      <div className="flex items-center">
        <Link
          href={item.url}
          onClick={onNavigate}
          target={item.open_in_new_tab ? "_blank" : undefined}
          rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
          className="flex-1 py-3.5 text-[15px] font-medium text-ink"
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center text-ink-soft"
            aria-label={`Toggle ${item.label} submenu`}
            aria-expanded={open}
          >
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="flex flex-col gap-0.5 pb-3 pl-4">
          {item.children.map((child) => (
            <Link
              key={child.url + child.label}
              href={child.url}
              onClick={onNavigate}
              className="rounded-lg py-2 text-sm text-ink-soft"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileMenu({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <div className="flex flex-col px-6 py-2">
        {items.map((item) => (
          <MobileMenuItem key={item.url + item.label} item={item} onNavigate={onClose} />
        ))}
      </div>
    </Drawer>
  );
}
