import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/account/auth-layout";
import { LoginForm } from "@/components/account/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Babycure account">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
