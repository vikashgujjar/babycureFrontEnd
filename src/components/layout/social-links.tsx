import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import type { PublicSettings } from "@/lib/types";

const PLATFORMS: Record<
  keyof PublicSettings["social"],
  { label: string; icon: (props: { className?: string }) => React.ReactNode }
> = {
  facebook_url: { label: "Facebook", icon: (p) => <FacebookIcon {...p} /> },
  instagram_url: { label: "Instagram", icon: (p) => <InstagramIcon {...p} /> },
  twitter_url: { label: "Twitter", icon: (p) => <TwitterIcon {...p} /> },
  youtube_url: { label: "YouTube", icon: (p) => <YoutubeIcon {...p} /> },
  linkedin_url: { label: "LinkedIn", icon: (p) => <LinkedinIcon {...p} /> },
  pinterest_url: { label: "Pinterest", icon: (p) => <PinterestIcon {...p} /> },
};

export function SocialLinks({ social }: { social: PublicSettings["social"] }) {
  const links = (Object.keys(PLATFORMS) as (keyof PublicSettings["social"])[])
    .map((key) => ({ key, url: social[key], ...PLATFORMS[key] }))
    .filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.url ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          aria-label={link.label}
          className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          {link.icon({ className: "size-4" })}
        </a>
      ))}
    </div>
  );
}
