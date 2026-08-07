import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getMenu, getPublicSettings } from "@/lib/api/queries/content";
import { SocialLinks } from "@/components/layout/social-links";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";

const POLICY_PATHS = ["/privacy-policy", "/terms-conditions", "/shipping-policy", "/refund-policy"];

export async function Footer() {
  const [footerMenu, settings] = await Promise.all([
    getMenu("footer").catch(() => null),
    getPublicSettings().catch(() => null),
  ]);

  const footerItems = footerMenu?.items ?? [];
  const quickLinks = footerItems.filter((item) => !POLICY_PATHS.includes(item.url));
  const policyLinks = footerItems.filter((item) => POLICY_PATHS.includes(item.url));
  const siteName = settings?.site_name ?? "Babycure";

  return (
    <footer className="bg-primary-dark text-white/80">
      <Container className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <Logo siteName={siteName} logoUrl={settings?.site_logo} variant="dark" />
          <p className="max-w-xs text-sm text-white/60">
            Dermatologically tested, thoughtfully formulated baby care — made for tiny, sensitive skin.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Quick Links</h3>
          {quickLinks.map((item) => (
            <Link key={item.url} href={item.url} className="text-sm text-white/60 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/shop" className="text-sm text-white/60 transition-colors hover:text-white">
            Shop All
          </Link>
        </nav>

        <nav className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Customer Care</h3>
          <Link href="/contact-us" className="text-sm text-white/60 transition-colors hover:text-white">
            Contact Us
          </Link>
          {policyLinks.map((item) => (
            <Link key={item.url} href={item.url} className="text-sm text-white/60 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/faq" className="text-sm text-white/60 transition-colors hover:text-white">
            FAQ&apos;s
          </Link>
          <Link href="/order/track" className="text-sm text-white/60 transition-colors hover:text-white">
            Track Order
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Follow Us</h3>
          <SocialLinks social={settings?.social ?? {}} whatsappNumber={settings?.whatsapp_number} />
        </div>

        <div className="col-span-2 flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white">Get in Touch</h3>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            {settings?.site_email && (
              <a href={`mailto:${settings.site_email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4" /> {settings.site_email}
              </a>
            )}
            {settings?.site_phone && (
              <a href={`tel:${settings.site_phone}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4" /> {settings.site_phone}
              </a>
            )}
            {settings?.site_address && (
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" /> {settings.site_address}
              </span>
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-center gap-2 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          {/* <p>Made with care for you and your little one.</p> */}
        </Container>
      </div>
    </footer>
  );
}
