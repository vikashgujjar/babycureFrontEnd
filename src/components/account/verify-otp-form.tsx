"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResendOtp, useVerifyOtp } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { verifyOtpSchema, type OtpPurpose, type VerifyOtpInput } from "@/lib/validation";
import { ApiError } from "@/lib/types";

const RESEND_COOLDOWN_SECONDS = 60;

const PURPOSE_COPY: Record<OtpPurpose, string> = {
  registration: "to verify your account",
  login: "to complete sign-in",
  password_reset: "to reset your password",
};

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const email = searchParams.get("email") ?? "";
  const purposeParam = searchParams.get("purpose");
  const purpose: OtpPurpose | null =
    purposeParam === "registration" || purposeParam === "login" || purposeParam === "password_reset"
      ? purposeParam
      : null;
  const redirect = searchParams.get("redirect") || "/account";

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, purpose: purpose ?? "registration" },
  });

  if (!email || !purpose) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink-soft">This verification link is invalid or has expired.</p>
        <Link href="/account/login" className="text-sm font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  function onSubmit(input: VerifyOtpInput) {
    verifyOtp.mutate(input, {
      onSuccess: (data) => {
        if (data.reset_token) {
          router.push(
            `/account/reset-password?email=${encodeURIComponent(email)}&reset_token=${encodeURIComponent(data.reset_token)}`,
          );
          return;
        }

        toast({ title: "Verified!", description: "You're all set.", variant: "success" });
        router.push(redirect);
        router.refresh();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldError("code")) {
          setError("code", { message: error.fieldError("code") });
        }
        toast({ title: "Couldn't verify code", description: error.message, variant: "error" });
      },
    });
  }

  function onResend() {
    resendOtp.mutate(
      { email, purpose: purpose! },
      {
        onSuccess: () => {
          setCooldown(RESEND_COOLDOWN_SECONDS);
          toast({ title: "Code resent", description: "Check your email for the new code.", variant: "success" });
        },
        onError: (error) => toast({ title: "Couldn't resend code", description: error.message, variant: "error" }),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("email")} />
      <input type="hidden" {...register("purpose")} />

      <p className="text-center text-sm text-ink-soft">
        We sent a 6-digit code to <span className="font-medium text-ink">{email}</span> {PURPOSE_COPY[purpose]}.
      </p>

      <Input
        label="Verification Code"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        className="text-center text-2xl tracking-[0.5em]"
        {...register("code")}
        error={errors.code?.message}
      />

      <Button type="submit" isLoading={verifyOtp.isPending} className="mt-1">
        Verify
      </Button>

      <div className="text-center text-sm text-ink-soft">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0 || resendOtp.isPending}
          className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-ink-soft/50 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}
