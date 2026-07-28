"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User, MapPin, Package, LogOut } from "lucide-react";
import { useCurrentCustomer, useLogout } from "@/lib/api/mutations/auth";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { useToast } from "@/components/ui/toast";

export function AccountMenu() {
  const { data: customer } = useCurrentCustomer();
  const logout = useLogout();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  if (!customer) {
    return (
      <Link
        href="/account/login"
        className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand"
        aria-label="Sign in"
      >
        <User className="size-5" strokeWidth={1.5} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <User className="size-5" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-paper shadow-lift"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="truncate text-sm font-medium text-ink">{customer.name}</p>
              <p className="truncate text-xs text-ink-soft">{customer.email}</p>
            </div>
            <nav className="flex flex-col p-1.5 text-sm">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-ink transition-colors hover:bg-sand"
              >
                <User className="size-4 text-ink-soft" /> Profile
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-ink transition-colors hover:bg-sand"
              >
                <Package className="size-4 text-ink-soft" /> Orders
              </Link>
              <Link
                href="/account/addresses"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-ink transition-colors hover:bg-sand"
              >
                <MapPin className="size-4 text-ink-soft" /> Addresses
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  logout.mutate(undefined, {
                    onSuccess: () => {
                      toast({ title: "Signed out", variant: "success" });
                      router.push("/");
                      router.refresh();
                    },
                  });
                }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-danger transition-colors hover:bg-danger/5"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
