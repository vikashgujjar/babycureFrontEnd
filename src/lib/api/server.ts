import { cookies } from "next/headers";
import { API_URL, CUSTOMER_TOKEN_COOKIE } from "@/lib/constants";
import { ApiError, type ApiEnvelope, type Paginated } from "@/lib/types";

interface ServerFetchOptions extends Omit<RequestInit, "body"> {
  /** Next's ISR revalidation window in seconds. Omit for `cache: 'no-store'`. */
  revalidate?: number | false;
  tags?: string[];
  /** Forwards the customer's auth cookie — only needed for personalized
   * Server Component reads (e.g. an order confirmation page). */
  withAuth?: boolean;
  body?: unknown;
}

async function rawRequest(
  path: string,
  { revalidate, tags, withAuth, body, headers, ...init }: ServerFetchOptions,
) {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (withAuth) {
    const store = await cookies();
    const token = store.get(CUSTOMER_TOKEN_COOKIE)?.value;
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    next: revalidate === false ? { tags } : { revalidate, tags },
    cache: revalidate === false ? "no-store" : init.cache,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload) {
    throw new ApiError(
      payload?.message ?? `Request failed (${response.status}).`,
      response.status,
      payload?.errors ?? [],
    );
  }

  return payload;
}

/**
 * Fetch helper for Server Components — uses Next's native fetch caching
 * (revalidate/tags) instead of axios, so RSC data fetching gets ISR for
 * free. Client Components should use lib/api/client.ts instead.
 */
export async function apiFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const payload = (await rawRequest(path, options)) as ApiEnvelope<T>;
  return payload.data;
}

/**
 * For genuinely paginated endpoints, the backend's ApiResponser trait calls
 * `$resourceCollection->additional([...])->response()`, which merges Laravel's
 * `links`/`meta` pagination keys as TOP-LEVEL siblings of `data` — not nested
 * inside it like the rest of the envelope. Plain apiFetch() would silently
 * discard them (it only returns `payload.data`), so paginated callers use
 * this instead to get `{data, links, meta}` intact.
 */
export async function apiFetchPaginated<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<Paginated<T>> {
  const payload = (await rawRequest(path, options)) as ApiEnvelope<T[]> & Paginated<T>;
  return { data: payload.data, links: payload.links, meta: payload.meta };
}
