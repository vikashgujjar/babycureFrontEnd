import type { Metadata } from "next";
import { AuthLayout } from "@/components/account/auth-layout";
import { ForgotPasswordForm } from "@/components/account/forgot-password-form";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot Password" subtitle="We'll email you a link to reset it">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
