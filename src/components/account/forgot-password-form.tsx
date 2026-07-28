"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation";
import { ApiError } from "@/lib/types";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  function onSubmit(input: ForgotPasswordInput) {
    forgotPassword.mutate(input, {
      onSuccess: (data) => {
        toast({ title: "Code sent", description: "Enter the code we emailed you.", variant: "success" });
        router.push(
          `/account/verify-otp?${new URLSearchParams({ email: data.email, purpose: "password_reset" }).toString()}`,
        );
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldError("email")) {
          setError("email", { message: error.fieldError("email") });
        }
        toast({ title: "Couldn't send code", description: error.message, variant: "error" });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Button type="submit" isLoading={forgotPassword.isPending}>
        Send Code
      </Button>
      <Link href="/account/login" className="text-center text-sm text-ink-soft hover:text-ink">
        Back to sign in
      </Link>
    </form>
  );
}
