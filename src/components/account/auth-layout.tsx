import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <h1 className="font-display text-2xl text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {children}
      </Card>
    </Container>
  );
}
