export const API_URL =
  // process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/public/api/v1";
  process.env.NEXT_PUBLIC_API_URL ?? "https://facerecognization.rgw-global.com/public/api/v1";

export const ASSET_URL =
  // process.env.NEXT_PUBLIC_ASSET_URL ?? "http://127.0.0.1:8000/public";
  process.env.NEXT_PUBLIC_ASSET_URL ?? "https://facerecognization.rgw-global.com/public";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Non-httpOnly on purpose — set client-side from the login/register response
 * body (Sanctum returns the token in JSON, not a Set-Cookie header), and read
 * by both client components and Server Components/middleware. */
export const CUSTOMER_TOKEN_COOKIE = "bc_token";

/** The backend cart/wishlist/checkout endpoints all require an authenticated
 * customer — there is no guest-cart API. Guests add to a local (localStorage)
 * cart instead; it's synced to the real backend cart right after login or
 * registration succeeds (see CartProvider). */
export const GUEST_CART_STORAGE_KEY = "bc_guest_cart";
