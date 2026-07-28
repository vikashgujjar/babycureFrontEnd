"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const resetPassword = useResetPassword();

  const resetToken = searchParams.get("reset_token") ?? "";
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { reset_token: resetToken, email },
  });

  if (!resetToken || !email) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink-soft">This password reset session is invalid or has expired.</p>
        <Link href="/account/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Request a new code
        </Link>
      </div>
    );
  }

  function onSubmit(input: ResetPasswordInput) {
    resetPassword.mutate(input, {
      onSuccess: () => {
        toast({ title: "Password reset", description: "Sign in with your new password.", variant: "success" });
        router.push("/account/login");
      },
      onError: (error) => toast({ title: "Couldn't reset password", description: error.message, variant: "error" }),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("reset_token")} />
      <input type="hidden" {...register("email")} />
      <Input label="New Password" type="password" {...register("password")} error={errors.password?.message} />
      <Input
        label="Confirm New Password"
        type="password"
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
      />
      <Button type="submit" isLoading={resetPassword.isPending}>
        Reset Password
      </Button>
    </form>
  );
}
