"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useCurrentCustomer, useLogout } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountSidebar() {
  const { data: customer } = useCurrentCustomer();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const logout = useLogout();

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-64 lg:shrink-0">
      {customer && (
        <div className="flex flex-col gap-0.5">
          <p className="font-medium text-ink">{customer.name}</p>
          <p className="text-sm text-ink-soft">{customer.email}</p>
        </div>
      )}

      <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary-light text-primary-dark" : "text-ink-soft hover:bg-sand hover:text-ink",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => {
                toast({ title: "Signed out", variant: "success" });
                router.push("/");
                router.refresh();
              },
            })
          }
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/5"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
