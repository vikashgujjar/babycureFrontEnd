import Cookies from "js-cookie";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/constants";

/** Sanctum returns the token in the JSON body, not a Set-Cookie header, so
 * the frontend owns writing/clearing this cookie itself. Non-httpOnly by
 * necessity — it must be readable by client code as well as Server
 * Components/middleware via next/headers. 30 days mirrors typical
 * "remember me" storefront session length. */
export function setSessionToken(token: string) {
  Cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
    expires: 30,
    sameSite: "lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
  });
}

export function clearSessionToken() {
  Cookies.remove(CUSTOMER_TOKEN_COOKIE);
}

export function getSessionToken() {
  return Cookies.get(CUSTOMER_TOKEN_COOKIE);
}
