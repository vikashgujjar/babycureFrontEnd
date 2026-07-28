"use client";

import Link from "next/link";
import type { MenuItem } from "@/lib/types";

export function MegaMenu({ items }: { items: MenuItem[] }) {
  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {items.map((item) => (
        <div key={item.url + item.label} className="group relative">
          <Link
            href={item.url}
            target={item.open_in_new_tab ? "_blank" : undefined}
            rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
            className="flex items-center rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-sand"
          >
            {item.label}
          </Link>

          {item.children.length > 0 && (
            <div className="invisible absolute left-0 top-full z-30 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="min-w-56 overflow-hidden rounded-2xl border border-line bg-paper py-2 shadow-lift">
                {item.children.map((child) => (
                  <Link
                    key={child.url + child.label}
                    href={child.url}
                    target={child.open_in_new_tab ? "_blank" : undefined}
                    rel={child.open_in_new_tab ? "noopener noreferrer" : undefined}
                    className="block px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-sand hover:text-ink"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
