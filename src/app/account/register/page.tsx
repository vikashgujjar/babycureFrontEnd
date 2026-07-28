import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/account/auth-layout";
import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Your Account" subtitle="Join Babycure for faster checkout and order tracking">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
