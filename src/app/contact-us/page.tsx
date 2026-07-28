import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublicSettings } from "@/lib/api/queries/content";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Babycure team — we're here to help.",
};

export default async function ContactUsPage() {
  const settings = await getPublicSettings().catch(() => null);

  return (
    <Container className="py-14">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Get In Touch</h1>
        <p className="mt-2 text-ink-soft">Questions about an order or our products? We&apos;d love to help.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="flex flex-col gap-4 p-6">
            {settings?.site_email && (
              <a href={`mailto:${settings.site_email}`} className="flex items-start gap-3 text-sm">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-ink-soft">{settings.site_email}</span>
              </a>
            )}
            {settings?.site_phone && (
              <a href={`tel:${settings.site_phone}`} className="flex items-start gap-3 text-sm">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-ink-soft">{settings.site_phone}</span>
              </a>
            )}
            {settings?.site_address && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-ink-soft">{settings.site_address}</span>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 lg:col-span-2">
          <ContactForm />
        </Card>
      </div>
    </Container>
  );
}
