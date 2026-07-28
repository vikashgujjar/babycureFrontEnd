"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/lib/api/mutations/auth";
import { useToast } from "@/components/ui/toast";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { ApiError } from "@/lib/types";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  function onSubmit(input: RegisterInput) {
    register_.mutate(input, {
      onSuccess: (data) => {
        toast({ title: "Almost there!", description: "Enter the code we emailed you.", variant: "success" });
        const redirect = searchParams.get("redirect");
        const params = new URLSearchParams({ email: data.email, purpose: "registration" });
        if (redirect) params.set("redirect", redirect);
        router.push(`/account/verify-otp?${params.toString()}`);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.fieldError("email")) setError("email", { message: error.fieldError("email") });
          if (error.fieldError("phone")) setError("phone", { message: error.fieldError("phone") });
        }
        toast({ title: "Couldn't create account", description: error.message, variant: "error" });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Full Name" {...register("name")} error={errors.name?.message} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Phone (optional)" type="tel" {...register("phone")} error={errors.phone?.message} />
      <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
      <Input
        label="Confirm Password"
        type="password"
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
      />

      <Button type="submit" isLoading={register_.isPending} className="mt-1">
        Create Account
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
