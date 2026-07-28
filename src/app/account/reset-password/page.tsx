import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/account/auth-layout";
import { ResetPasswordForm } from "@/components/account/reset-password-form";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset Password" subtitle="Choose a new password for your account">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
