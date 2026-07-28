import { getMenu, getPublicSettings } from "@/lib/api/queries/content";
import { HeaderClient } from "@/components/layout/header-client";
import { AnnouncementBar } from "@/components/layout/announcement-bar";

export async function Header() {
  const [menu, settings] = await Promise.all([
    getMenu("header").catch(() => null),
    getPublicSettings().catch(() => null),
  ]);

  return (
    <>
      {settings && <AnnouncementBar announcement={settings.announcement_bar} />}
      <HeaderClient menu={menu} settings={settings} />
    </>
  );
}
