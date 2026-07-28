"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <input
              ref={inputRef}
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              type="search"
              placeholder="Search products…"
              className="h-10 w-60 rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </motion.form>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setOpen((v) => !v);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand"
        aria-label={open ? "Close search" : "Open search"}
      >
        {open ? <X className="size-5" strokeWidth={1.5} /> : <Search className="size-5" strokeWidth={1.5} />}
      </button>
    </div>
  );
}
