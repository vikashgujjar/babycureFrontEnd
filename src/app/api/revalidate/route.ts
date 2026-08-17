import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand cache revalidation, called by the Laravel backend (see
 * App\Services\FrontendCacheService) right after content changes — e.g. an
 * admin saving a CMS page — instead of waiting out the fetch() `revalidate`
 * window on the corresponding query. Protected by a shared secret so this
 * can't be used by an outsider to force-purge the cache repeatedly.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.FRONTEND_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tag = body?.tag;

  if (!tag || typeof tag !== "string") {
    return NextResponse.json({ revalidated: false, message: "Missing tag" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
