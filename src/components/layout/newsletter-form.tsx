"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";
import { useSubscribeNewsletter } from "@/lib/api/mutations/contact";
import { useToast } from "@/components/ui/toast";

export function NewsletterForm() {
  const { toast } = useToast();
  const subscribe = useSubscribeNewsletter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  function onSubmit(input: NewsletterInput) {
    subscribe.mutate(
      { ...input, source: "footer" },
      {
        onSuccess: () => {
          toast({ title: "Subscribed!", description: "Watch your inbox for offers.", variant: "success" });
          reset();
        },
        onError: (error) => {
          toast({ title: "Couldn't subscribe", description: error.message, variant: "error" });
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          {...register("email")}
          type="email"
          placeholder="Your email address"
          className="h-11 flex-1 rounded-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
          aria-label="Subscribe"
        >
          <Send className="size-4" />
        </button>
      </div>
      {errors.email && <p className="text-xs text-accent-light">{errors.email.message}</p>}
    </form>
  );
}
