import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { API_URL, CUSTOMER_TOKEN_COOKIE } from "@/lib/constants";
import { ApiError, type ApiEnvelope } from "@/lib/types";

/**
 * The one axios instance every Client Component / TanStack Query hook goes
 * through. Server Components use lib/api/server.ts instead, so they get
 * Next's fetch-based caching — this instance is for interactive,
 * personalized, or mutation-driving requests (cart, auth, checkout, account).
 */
export const http = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = Cookies.get(CUSTOMER_TOKEN_COOKIE);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const body = error.response.data as ApiEnvelope<null> | undefined;

      throw new ApiError(
        body?.message ?? "Something went wrong. Please try again.",
        error.response.status,
        body?.errors ?? [],
      );
    }

    throw new ApiError("Unable to reach the server. Check your connection.", 0);
  },
);

/** Unwraps the {success, message, data, errors} envelope for callers that
 * only care about the payload. */
export async function unwrap<T>(
  promise: Promise<{ data: ApiEnvelope<T> }>,
): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export type { AxiosRequestConfig };
