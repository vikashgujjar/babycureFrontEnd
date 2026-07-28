import { useMutation } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type { ContactInput, NewsletterInput } from "@/lib/validation";

export function useSubmitContact() {
  return useMutation({
    mutationFn: (input: ContactInput) => unwrap(http.post("/contact", input)),
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (input: NewsletterInput) => unwrap(http.post("/newsletter/subscribe", input)),
  });
}

export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) => unwrap(http.post("/newsletter/unsubscribe", { email })),
  });
}
