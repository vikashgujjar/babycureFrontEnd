import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AccountSidebar } from "@/components/account/account-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="flex flex-col gap-8 py-10 lg:flex-row">
      <AccountSidebar />
      <div className="flex-1">{children}</div>
    </Container>
  );
}
