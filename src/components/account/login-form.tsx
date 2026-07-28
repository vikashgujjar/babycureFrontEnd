"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { ApiError } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  function onSubmit(input: LoginInput) {
    login.mutate(input, {
      onSuccess: (data) => {
        const purpose = data.requires_verification ? "registration" : "login";
        toast({ title: "Almost there!", description: "Enter the code we emailed you.", variant: "success" });
        const redirect = searchParams.get("redirect");
        const params = new URLSearchParams({ email: data.email, purpose });
        if (redirect) params.set("redirect", redirect);
        router.push(`/account/verify-otp?${params.toString()}`);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldError("email")) {
          setError("email", { message: error.fieldError("email") });
        }
        toast({ title: "Couldn't sign in", description: error.message, variant: "error" });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

      <div className="flex justify-end">
        <Link href="/account/forgot-password" className="text-xs font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={login.isPending} className="mt-1">
        Sign In
      </Button>

      <p className="text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href="/account/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
